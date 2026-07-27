import React, { useState } from "react";
import ReportCard from "../../../components/admin/ReportCard";
import { reportsData, userGrowthData, subscriptionsGrowthData } from "../../../data/adminDashboardData";

export default function ReportsSection() {
    const [selectedReport, setSelectedReport] = useState(null);

    const handleSelectReport = (reportId) => {
        setSelectedReport(selectedReport === reportId ? null : reportId);
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
                        <button className="text-sm bg-blue-600 text-white font-bold px-4 py-2 rounded-xl hover:bg-blue-700 transition shadow-sm">Export CSV</button>
                    </div>
                    <div className="flex items-end gap-2 sm:gap-4 h-64 border-b border-gray-100 pb-2">
                        {userGrowthData.map((data, idx) => {
                            const maxUsers = 1000; 
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
                    <div className="mt-4 text-center text-sm text-gray-500 font-medium">Total active users over the last 7 months</div>
                </div>
            )}

            {selectedReport === "subscriptions" && (
                <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold text-gray-800">Subscriptions Growth Report</h3>
                        <button className="text-sm bg-purple-600 text-white font-bold px-4 py-2 rounded-xl hover:bg-purple-700 transition shadow-sm">Export CSV</button>
                    </div>
                    
                    <div className="overflow-x-auto border border-gray-100 rounded-2xl">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-50 text-gray-600 font-semibold border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">Month</th>
                                    <th className="px-6 py-4">Basic Plan</th>
                                    <th className="px-6 py-4">Pro Plan</th>
                                    <th className="px-6 py-4">Enterprise Plan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {subscriptionsGrowthData.map((data, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 transition">
                                        <td className="px-6 py-4 font-bold text-gray-800">{data.month}</td>
                                        <td className="px-6 py-4 text-slate-600 font-medium">{data.basic} users</td>
                                        <td className="px-6 py-4 text-blue-600 font-medium">{data.pro} users</td>
                                        <td className="px-6 py-4 text-purple-600 font-medium">{data.enterprise} users</td>
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
