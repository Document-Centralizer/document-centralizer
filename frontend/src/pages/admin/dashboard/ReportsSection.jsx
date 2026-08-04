import React, { useState, useEffect } from "react";
import ReportCard from "../../../components/admin/ReportCard";
import { reportsData } from "../../../data/adminDashboardData";
import api from "../../../services/api";

export default function ReportsSection() {
    const [selectedReport, setSelectedReport] = useState("users");
    const [userGrowthData, setUserGrowthData] = useState([]);
    const [subscriptionsGrowthData, setSubscriptionsGrowthData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReportsData = async () => {
            try {
                const response = await api.get('/admin/users');
                const users = response.data;
                
                // Aggregate data by month (last 6 months)
                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const now = new Date();
                
                let growth = [];
                let subs = [];
                
                for (let i = 5; i >= 0; i--) {
                    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                    const monthStr = monthNames[d.getMonth()];
                    
                    // Count users created up to or in this month
                    // For simplicity, we just count users created in this specific month
                    const usersInMonth = users.filter(u => {
                        if (!u.createdAt) return false;
                        const created = new Date(u.createdAt);
                        return created.getMonth() === d.getMonth() && created.getFullYear() === d.getFullYear();
                    });
                    
                    growth.push({
                        month: monthStr,
                        users: usersInMonth.length
                    });
                    
                    let basic = 0;
                    let pro = 0;
                    usersInMonth.forEach(u => {
                        if (u.subscriptionPlan === "Pro") pro++;
                        else basic++;
                    });
                    
                    subs.push({
                        month: monthStr,
                        basic,
                        pro,
                        enterprise: 0
                    });
                }
                
                setUserGrowthData(growth);
                setSubscriptionsGrowthData(subs);
                
            } catch (error) {
                console.error("Failed to fetch report data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReportsData();
    }, []);

    const handleSelectReport = (reportId) => {
        setSelectedReport(selectedReport === reportId ? null : reportId);
    };

    const exportToCSV = (data, filename) => {
        if (!data || !data.length) return;
        const headers = Object.keys(data[0]).join(",");
        const csvRows = data.map(row => Object.values(row).join(","));
        const csvString = [headers, ...csvRows].join("\n");
        const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="animate-in fade-in duration-300">
            <h2 className="text-xl font-bold text-gray-800 mb-6">System Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {reportsData.map((report) => (
                    <ReportCard 
                        key={report.id} 
                        report={report} 
                        isActive={selectedReport === report.id}
                        onSelect={handleSelectReport}
                    />
                ))}
            </div>

            {selectedReport === "users" && (
                <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold text-gray-800">User Growth Report</h3>
                        <button 
                            onClick={() => exportToCSV(userGrowthData, 'user_growth_report.csv')}
                            className="text-sm bg-blue-600 text-white font-bold px-4 py-2 rounded-xl hover:bg-blue-700 transition shadow-sm"
                        >
                            Export CSV
                        </button>
                    </div>
                    <div className="flex items-end gap-2 sm:gap-4 h-64 border-b border-gray-100 pb-2">
                        {userGrowthData.map((data, idx) => {
                            // find max dynamically for the graph scale
                            const maxUsers = Math.max(...userGrowthData.map(d => d.users), 10); 
                            const heightPercentage = (data.users / maxUsers) * 100;
                            return (
                                <div key={idx} className="flex-1 flex flex-col items-center justify-end gap-2 group h-full">
                                    <div className="text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity mb-1">{data.users}</div>
                                    <div 
                                        className="w-full bg-blue-100 group-hover:bg-blue-500 transition-colors rounded-t-lg"
                                        style={{ height: `${heightPercentage}%` }}
                                    ></div>
                                    <span className="text-sm font-medium text-gray-600 mt-2">{data.month}</span>
                                </div>
                            )
                        })}
                    </div>
                    <div className="mt-4 text-center text-sm text-gray-500 font-medium">New users registered per month over the last 6 months</div>
                </div>
            )}

            {selectedReport === "subscriptions" && (
                <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold text-gray-800">Subscriptions Growth Report</h3>
                        <button 
                            onClick={() => exportToCSV(subscriptionsGrowthData, 'subscriptions_growth_report.csv')}
                            className="text-sm bg-purple-600 text-white font-bold px-4 py-2 rounded-xl hover:bg-purple-700 transition shadow-sm"
                        >
                            Export CSV
                        </button>
                    </div>
                    
                    <div className="overflow-x-auto border border-gray-100 rounded-2xl">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-50 text-gray-600 font-semibold border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">Month</th>
                                    <th className="px-6 py-4">Basic Plan</th>
                                    <th className="px-6 py-4">Pro Plan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {subscriptionsGrowthData.map((data, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 transition">
                                        <td className="px-6 py-4 font-bold text-gray-800">{data.month}</td>
                                        <td className="px-6 py-4 text-slate-600 font-medium">{data.basic} users</td>
                                        <td className="px-6 py-4 text-blue-600 font-medium">{data.pro} users</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
