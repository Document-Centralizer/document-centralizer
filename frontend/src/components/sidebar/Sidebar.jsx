import { 
    LayoutDashboard, FileText, Upload, Clock3, CheckCircle, XCircle, 
    ShieldCheck, History, CreditCard, Receipt, User, Settings, LogOut, 
    Users, Database, FileSearch, Inbox, Settings2, BarChart
} from "lucide-react";
import { UserCircle2 } from "lucide-react";
import { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();

    const getSidebarData = (role) => {
        if (role === 'superadmin') {
            return [
                {
                    title: "MAIN",
                    menus: [
                        // Dashboard for overall metrics
                        { name: "Dashboard", path: "/superadmin", icon: LayoutDashboard },
                        // Main queue for pending verifications
                        { name: "Verification Queue", path: "/superadmin/queue", icon: Inbox },
                        // Single clean link to view all processed documents
                        { name: "All Documents", path: "/superadmin/history", icon: History },
                    ],
                },
                {
                    title: "ACCOUNT",
                    menus: [
                        { name: "Profile", path: "/superadmin/profile", icon: User },
                    ],
                }
            ];
        }

        if (role === 'admin') {
            return [
                {
                    title: "MAIN",
                    menus: [
                        // Dashboard for admin metrics
                        { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
                        // Manage user accounts
                        { name: "Users", path: "/admin/users", icon: Users },
                        // Single clean link for all document statuses
                        { name: "All Documents", path: "/admin/documents", icon: Database },
                    ],
                },
                {
                    title: "SYSTEM",
                    menus: [
                        { name: "Categories", path: "/admin/categories", icon: FileSearch },
                        { name: "Subscription", path: "/admin/subscription", icon: CreditCard },
                        { name: "Reports", path: "/admin/reports", icon: BarChart },
                    ],
                },
                {
                    title: "ACCOUNT",
                    menus: [
                        { name: "Profile", path: "/admin/profile", icon: User },
                    ],
                }
            ];
        }

        // Default return for standard users
        return [
            {
                title: "MAIN",
                menus: [
                    // User's main dashboard
                    { name: "Dashboard", path: "/user", icon: LayoutDashboard },
                    // Single clean link to manage all their documents (pending, verified, etc.)
                    { name: "My Documents", path: "/user/my-documents", icon: FileText },
                    // Quick link to upload a new document
                    { name: "Upload Document", path: "/user/upload", icon: Upload },
                ],
            },
            {
                title: "SUBSCRIPTION",
                menus: [
                    { name: "My Plan", path: "/user/subscription", icon: CreditCard },
                ],
            },
            {
                title: "ACCOUNT",
                menus: [
                    { name: "Profile", path: "/user/profile", icon: User },
                ],
            },
        ];
    };

    const sidebarData = getSidebarData(user?.role);
    const roleDisplay = user?.role === 'superadmin' ? 'Super Admin' : user?.role === 'admin' ? 'Admin Portal' : 'User Portal';

    return (
        <aside 
            onMouseEnter={() => setIsCollapsed(false)}
            onMouseLeave={() => setIsCollapsed(true)}
            className={`
                ${isCollapsed ? "w-20" : "w-72"}
                bg-white border-r border-slate-200 flex flex-col transition-all duration-300 z-50
            `}
        >
            <div className="h-20 border-b border-slate-200 flex items-center justify-center p-4">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="flex items-center justify-center w-full"
                >
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold shrink-0">
                        DC
                    </div>
                    {!isCollapsed && (
                        <div className="ml-3 text-left overflow-hidden">
                            <h2 className="font-bold text-slate-900 truncate">DocCentralizer</h2>
                            <p className="text-xs text-slate-500 truncate">{roleDisplay}</p>
                        </div>
                    )}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 hide-scrollbar">
                {sidebarData.map((section) => (
                    <div key={section.title} className="mb-6">
                        {!isCollapsed && (
                            <p className="text-xs text-slate-400 font-semibold uppercase mb-2 px-3 tracking-wider">
                                {section.title}
                            </p>
                        )}
                        <div className="space-y-1">
                            {section.menus.map((menu) => {
                                const isActive = location.pathname === menu.path;
                                return (
                                    <Link 
                                        to={menu.path}
                                        key={menu.name} 
                                        className={`
                                            w-full flex items-center ${isCollapsed ? "justify-center" : "gap-3"} p-3 rounded-xl text-sm font-medium transition-all
                                            ${isActive ? "bg-slate-900 text-white shadow-md shadow-slate-200" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}
                                        `}
                                    >
                                        <menu.icon size={20} className={isActive ? "text-white" : "text-slate-500"} />
                                        {!isCollapsed && <span className="truncate">{menu.name}</span>}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t border-slate-200 p-4">
                <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
                    <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
                        {isCollapsed ? (
                            <UserCircle2 size={25} className="text-slate-700" />
                        ) : (
                            <>
                                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center font-semibold shrink-0">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-sm font-medium text-slate-900 truncate">{user?.name || 'User'}</p>
                                    <p className="text-xs text-slate-500 capitalize truncate">{user?.role || 'user'}</p>
                                </div>
                            </>
                        )}
                    </div>
                    {!isCollapsed && (
                        <button onClick={logout} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                            <LogOut size={18} />
                        </button>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
