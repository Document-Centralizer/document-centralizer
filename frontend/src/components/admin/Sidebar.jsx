import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { tabs, tabIcons } from "../../data/adminDashboardData";

export default function Sidebar({ activeTab, setActiveTab }) {
    const navigate = useNavigate();

    const handleSignOut = () => {
        navigate("/login");
    };

    return (
        <div className="w-full md:w-64 shrink-0 flex flex-col p-6 bg-white rounded-3xl shadow-xl border border-gray-100">
            <div className="mb-6 px-2">
                <h2 className="text-xl font-bold text-gray-800">Admin Portal</h2>
                <p className="text-xs text-gray-500 mt-1">Manage system modules</p>
            </div>
            
            <div className="flex flex-col gap-2 flex-1">
                {tabs.map((tab) => {
                    const Icon = tabIcons[tab];
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

            <div className="mt-6 pt-6 border-t border-gray-100">
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all w-full text-left bg-transparent text-red-600 hover:bg-red-50"
                >
                    <LogOut size={20} className="text-red-500" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
