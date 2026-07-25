import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Inbox, CheckCircle, History, BarChart, User } from "lucide-react";

const SuperAdminLayout = () => {
    const location = useLocation();
    
    const tabs = [
        { name: "Dashboard", path: "/superadmin", icon: LayoutDashboard },
        { name: "Verification Queue", path: "/superadmin/verification-queue", icon: Inbox },
        { name: "Document Review", path: "/superadmin/document-review", icon: CheckCircle },
        { name: "Approval History", path: "/superadmin/approval-history", icon: History },
        { name: "Reports", path: "/superadmin/reports", icon: BarChart },
        { name: "Profile", path: "/superadmin/profile", icon: User }
    ];

    return (
        <div className="flex flex-col md:flex-row gap-6 w-full font-sans min-h-screen bg-slate-50 p-4 sm:p-6">
            {/* Local Sidebar */}
            <div className="w-full md:w-64 shrink-0 flex flex-col gap-2 p-6 bg-white rounded-3xl shadow-xl border border-gray-100 h-fit">
                <div className="mb-6 px-2">
                    <h2 className="text-xl font-bold text-gray-800">Super Admin</h2>
                    <p className="text-xs text-gray-500 mt-1">Manage system modules</p>
                </div>
                {tabs.map((tab) => {
                    const isActive = location.pathname === tab.path || (tab.path === "/superadmin" && location.pathname === "/superadmin/dashboard");
                    const Icon = tab.icon;
                    return (
                        <Link
                            key={tab.name}
                            to={tab.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all w-full text-left ${
                                isActive
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                    : "bg-transparent text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            <Icon size={20} className={isActive ? "text-white" : "text-gray-400"} />
                            {tab.name}
                        </Link>
                    );
                })}
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8">
                <Outlet />
            </div>
        </div>
    );
};

export default SuperAdminLayout;