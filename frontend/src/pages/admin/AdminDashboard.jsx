import React, { useState } from "react";
import { Users, FileText, CheckCircle, Clock3, ShieldCheck, Database, CreditCard, BarChart, FileSearch, XCircle, LayoutDashboard } from "lucide-react";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("Dashboard");

    const tabs = [
        "Dashboard", "Users", "Documents", "Pending Reviews", "Categories", "Subscriptions", "Reports"
    ];

    const stats = [
        { title: "Total Users", value: "1,248", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
        { title: "Documents Stored", value: "8,432", icon: Database, color: "text-slate-600", bg: "bg-slate-200" },
        { title: "Pending Reviews", value: "156", icon: Clock3, color: "text-yellow-600", bg: "bg-yellow-100" },
        { title: "System Health", value: "99.9%", icon: ShieldCheck, color: "text-green-600", bg: "bg-green-100" },
    ];

    const renderDashboardOverview = () => (
        <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="hover:shadow-lg transition-shadow border-gray-100 shadow-md rounded-2xl bg-white h-full">
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                                <stat.icon size={28} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-semibold">{stat.title}</p>
                                <h3 className="text-2xl font-extrabold text-gray-800">{stat.value}</h3>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-md border-gray-100 rounded-2xl bg-white">
                    <CardHeader title="Recent Activity" subtitle="Latest platform actions" />
                    <CardContent className="p-0 divide-y divide-gray-50">
                        {[
                            { action: "User Registration", desc: "Alice Smith joined", time: "5 mins ago", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
                            { action: "Document Approval", desc: "Financial Report Q3", time: "1 hour ago", icon: CheckCircle, color: "text-green-500", bg: "bg-green-50" },
                            { action: "Subscription Alert", desc: "Acme Corp upgraded to Pro", time: "2 hours ago", icon: CreditCard, color: "text-purple-500", bg: "bg-purple-50" }
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-5 hover:bg-slate-50 transition">
                                <div className={`p-3 rounded-xl ${item.bg} ${item.color}`}>
                                    <item.icon size={20} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-800 text-sm">{item.action}</h4>
                                    <p className="text-xs text-gray-500">{item.desc}</p>
                                </div>
                                <span className="text-xs font-medium text-gray-400">{item.time}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                
                <Card className="shadow-md border-gray-100 rounded-2xl bg-white">
                    <CardHeader title="System Status" subtitle="Platform health and metrics" />
                    <CardContent className="p-6 space-y-6">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-semibold text-gray-700">Storage Capacity</span>
                                <span className="text-gray-500">428 GB / 1 TB</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "42%" }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-semibold text-gray-700">Server Load</span>
                                <span className="text-gray-500">28%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "28%" }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-semibold text-gray-700">API Requests</span>
                                <span className="text-gray-500">89k / 100k limit</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                                <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "89%" }}></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    const renderUsers = () => (
        <div className="animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">User Management</h2>
                    <p className="text-sm text-gray-500">View and manage all registered users.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition shadow-sm">
                    + Add New User
                </button>
            </div>
            
            <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 text-gray-600 font-semibold">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 bg-white">
                        {[
                            { name: "Alice Smith", email: "alice@example.com", role: "USER", status: "Active" },
                            { name: "Bob Johnson", email: "bob@example.com", role: "ADMIN", status: "Active" },
                            { name: "Charlie Brown", email: "charlie@example.com", role: "USER", status: "Inactive" },
                        ].map((user, i) => (
                            <tr key={i} className="hover:bg-slate-50 transition">
                                <td className="px-6 py-4 font-semibold text-gray-800">{user.name}</td>
                                <td className="px-6 py-4 text-gray-500">{user.email}</td>
                                <td className="px-6 py-4 text-gray-500 text-xs font-bold">{user.role}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button className="text-blue-600 hover:text-blue-800 font-semibold transition">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderDocuments = () => (
        <div className="animate-in fade-in duration-300">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Document Repository</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Dummy stats for documents */}
                <div className="p-6 rounded-2xl border border-blue-100 bg-blue-50 text-blue-700 flex flex-col gap-2">
                    <FileText size={24} />
                    <h3 className="font-bold text-xl">5,432</h3>
                    <p className="text-sm font-medium opacity-80">Approved Documents</p>
                </div>
                <div className="p-6 rounded-2xl border border-yellow-100 bg-yellow-50 text-yellow-700 flex flex-col gap-2">
                    <Clock3 size={24} />
                    <h3 className="font-bold text-xl">156</h3>
                    <p className="text-sm font-medium opacity-80">Pending Review</p>
                </div>
                <div className="p-6 rounded-2xl border border-red-100 bg-red-50 text-red-700 flex flex-col gap-2">
                    <XCircle size={24} />
                    <h3 className="font-bold text-xl">89</h3>
                    <p className="text-sm font-medium opacity-80">Rejected Documents</p>
                </div>
            </div>
        </div>
    );

    const renderPendingReviews = () => (
        <div className="animate-in fade-in duration-300">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Pending Document Reviews</h2>
            <p className="text-sm text-gray-500 mb-6">Documents requiring administrative approval.</p>
            
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-5 border border-gray-200 rounded-2xl hover:border-blue-300 transition-colors bg-white shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl"><FileText size={20} /></div>
                            <div>
                                <h4 className="font-bold text-gray-800">Financial_Report_2026.pdf</h4>
                                <p className="text-xs text-gray-500">Uploaded by John Doe • 2 hours ago • Category: Finance</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-xl text-sm font-bold transition">Approve</button>
                            <button className="px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl text-sm font-bold transition">Reject</button>
                            <button className="px-4 py-2 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-xl text-sm font-bold transition">View</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderCategories = () => (
        <div className="animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Document Categories</h2>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition shadow-sm">+ Add Category</button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {["Finance", "Legal", "Human Resources", "Engineering", "Marketing", "Personal", "Medical"].map(cat => (
                    <div key={cat} className="p-5 border border-gray-200 rounded-2xl hover:shadow-md transition bg-white flex flex-col items-center justify-center text-center gap-3">
                        <div className="p-3 bg-slate-50 text-slate-600 rounded-full"><FileSearch size={24} /></div>
                        <h4 className="font-bold text-gray-800">{cat}</h4>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderSubscriptions = () => (
        <div className="animate-in fade-in duration-300">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Subscription Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {name: "Basic", price: "Free", users: "1,024 Active", color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200"},
                    {name: "Pro", price: "$9.99/mo", users: "432 Active", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200"},
                    {name: "Enterprise", price: "$49.99/mo", users: "89 Active", color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200"}
                ].map(plan => (
                    <div key={plan.name} className={`p-8 rounded-3xl border ${plan.border} bg-white shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden flex flex-col items-center text-center`}>
                        <div className={`absolute top-0 w-full h-2 ${plan.bg}`}></div>
                        <h3 className="font-bold text-xl text-gray-800 mt-2">{plan.name}</h3>
                        <div className={`text-4xl font-extrabold mt-4 mb-2 ${plan.color}`}>{plan.price}</div>
                        <p className="text-sm text-gray-500 font-medium mb-8">{plan.users}</p>
                        <button className="w-full py-3 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50 transition mt-auto">Manage Plan</button>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderReports = () => (
        <div className="animate-in fade-in duration-300">
            <h2 className="text-xl font-bold text-gray-800 mb-6">System Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 border border-gray-200 rounded-3xl bg-white shadow-sm flex flex-col items-center text-center justify-center h-64">
                    <BarChart size={40} className="text-blue-500 mb-4" />
                    <h3 className="font-bold text-lg text-gray-800">User Growth Report</h3>
                    <p className="text-sm text-gray-500 mt-2 mb-6">Export monthly user acquisition metrics</p>
                    <button className="px-6 py-2.5 bg-blue-50 text-blue-700 font-bold rounded-xl hover:bg-blue-100 transition">Download CSV</button>
                </div>
                <div className="p-8 border border-gray-200 rounded-3xl bg-white shadow-sm flex flex-col items-center text-center justify-center h-64">
                    <Database size={40} className="text-green-500 mb-4" />
                    <h3 className="font-bold text-lg text-gray-800">Storage Usage Report</h3>
                    <p className="text-sm text-gray-500 mt-2 mb-6">Export storage metrics by document type</p>
                    <button className="px-6 py-2.5 bg-green-50 text-green-700 font-bold rounded-xl hover:bg-green-100 transition">Download CSV</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col md:flex-row gap-6 w-full font-sans min-h-[calc(100vh-3rem)]">
            {/* Local Sidebar */}
            <div className="w-full md:w-64 shrink-0 flex flex-col gap-2 p-6 bg-white rounded-3xl shadow-xl border border-gray-100 h-fit">
                <div className="mb-6 px-2">
                    <h2 className="text-xl font-bold text-gray-800">Admin Portal</h2>
                    <p className="text-xs text-gray-500 mt-1">Manage system modules</p>
                </div>
                {tabs.map((tab) => {
                    const icons = {
                        "Dashboard": LayoutDashboard,
                        "Users": Users,
                        "Documents": Database,
                        "Pending Reviews": Clock3,
                        "Categories": FileSearch,
                        "Subscriptions": CreditCard,
                        "Reports": BarChart
                    };
                    const Icon = icons[tab];
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all w-full text-left ${
                                activeTab === tab
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                    : "bg-transparent text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            <Icon size={20} className={activeTab === tab ? "text-white" : "text-gray-400"} />
                            {tab}
                        </button>
                    );
                })}
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8">
                {activeTab === "Dashboard" && renderDashboardOverview()}
                {activeTab === "Users" && renderUsers()}
                {activeTab === "Documents" && renderDocuments()}
                {activeTab === "Pending Reviews" && renderPendingReviews()}
                {activeTab === "Categories" && renderCategories()}
                {activeTab === "Subscriptions" && renderSubscriptions()}
                {activeTab === "Reports" && renderReports()}
            </div>
        </div>
    );
}
