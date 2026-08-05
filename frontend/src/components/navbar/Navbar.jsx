import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";

// Icons from lucide-react
import { Search, ChevronDown, User, Settings, FileText, CreditCard, Shield, LogOut, Moon, Sun, Menu, X, Plus, Upload, Share2, ShieldCheck } from "lucide-react";

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // States for toggling menus
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isThemeOpen, setIsThemeOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "Light");
    
    // State to hold live profile data (e.g., isPremium)
    const [profileData, setProfileData] = useState(null);

    // Fetch live profile data so we can see if they upgraded to Premium
    useEffect(() => {
        if (user) {
            api.get('/users/profile')
                .then(res => setProfileData(res.data))
                .catch(err => console.error("Failed to fetch profile data", err));
        }
    }, [user]);

    // Close dropdowns if clicked outside (Simple implementation)
    const navRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setIsProfileOpen(false);
                setIsCreateOpen(false);
                setIsThemeOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle Theme Change
    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === "Dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    // Handle Logout
    const handleLogout = () => {
        setIsProfileOpen(false);
        logout();
        navigate("/login");
    };

    return (
        <header ref={navRef} className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-40">
            
            {/* 1. Left Side: Logo, Mobile Menu & Greeting */}
            <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                <button 
                    className="md:hidden p-2 text-slate-600 dark:text-slate-300"
                    onClick={() => setIsMobileMenuOpen(true)}
                >
                    <Menu size={24} />
                </button>

                {/* Greeting */}
                <div className="hidden md:block">
                    <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                        Hi, {profileData?.firstName || profileData?.username || user?.name?.split(' ')[0] || "Student"} 👋
                    </h1>
                </div>
            </div>

            {/* 2. Right Side: Actions & Profile */}
            <div className="flex items-center gap-4 relative">
                
                {/* Quick Create Button */}
                <div className="relative hidden sm:block">
                    <button 
                        onClick={() => {
                            setIsCreateOpen(!isCreateOpen);
                            setIsProfileOpen(false);
                            setIsThemeOpen(false);
                        }}
                        className="flex items-center gap-2 bg-slate-900 dark:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800"
                    >
                        <Plus size={16} /> Create
                    </button>

                    {/* Quick Create Dropdown */}
                    {isCreateOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-2">
                            <Link to="/user/upload" className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm">
                                <Upload size={16} /> Upload Document
                            </Link>
                        </div>
                    )}
                </div>

                {/* Theme Toggle Button */}
                <div className="relative hidden lg:block">
                    <button 
                        onClick={() => {
                            setIsThemeOpen(!isThemeOpen);
                            setIsProfileOpen(false);
                            setIsCreateOpen(false);
                        }}
                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                    >
                        {theme === "Dark" ? <Moon size={20} /> : <Sun size={20} />}
                    </button>

                    {/* Theme Dropdown */}
                    {isThemeOpen && (
                        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-2">
                            <button onClick={() => { setTheme("Light"); setIsThemeOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm">Light</button>
                            <button onClick={() => { setTheme("Dark"); setIsThemeOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm">Dark</button>
                        </div>
                    )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                    <button 
                        onClick={() => {
                            setIsProfileOpen(!isProfileOpen);
                            setIsCreateOpen(false);
                            setIsThemeOpen(false);
                        }}
                        className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg"
                    >
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user?.name || "Student"}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role || "user"}</p>
                        </div>
                        <ChevronDown size={16} className="text-slate-400" />
                    </button>

                    {/* Profile Menu Box */}
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-2">
                            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <p className="font-bold text-slate-800 dark:text-slate-200">{user?.name || "Student"}</p>
                                    {profileData?.isPremium && (
                                        <span className="flex items-center gap-0.5 text-[9px] font-bold bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full border border-yellow-200">
                                            ⭐ Premium
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email || "student@cdac.in"}</p>
                                {/* Optional: Show verified badge if the user is verified */}
                                {user?.enabled && (
                                    <div className="flex items-center gap-1 mt-1">
                                        <ShieldCheck size={11} className="text-green-500"/>
                                        <span className="text-[10px] text-green-600 font-semibold">Verified Account</span>
                                    </div>
                                )}
                            </div>
                            
                            <Link to="/user/profile" className="flex items-center gap-3 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm">
                                <User size={16} /> My Profile
                            </Link>
                            <Link to="/user/my-documents" className="flex items-center gap-3 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm">
                                <FileText size={16} /> My Documents
                            </Link>
                            
                            <div className="border-t border-slate-100 dark:border-slate-700 mt-2 pt-2">
                                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 text-sm">
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Menu Sidebar */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 flex">
                    {/* Dark background overlay */}
                    <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}></div>
                    
                    {/* Sidebar menu */}
                    <div className="relative w-64 bg-white dark:bg-slate-900 h-full p-6 shadow-xl flex flex-col">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="font-bold text-lg dark:text-white">Menu</h2>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-500 dark:text-slate-300">
                                <X size={24} />
                            </button>
                        </div>
                        <Link to="/user" className="py-3 text-slate-700 dark:text-slate-300 font-medium border-b border-slate-100 dark:border-slate-800">Dashboard</Link>
                        <Link to="/user/my-documents" className="py-3 text-slate-700 dark:text-slate-300 font-medium border-b border-slate-100 dark:border-slate-800">My Documents</Link>
                        <Link to="/user/upload" className="py-3 text-slate-700 dark:text-slate-300 font-medium border-b border-slate-100 dark:border-slate-800">Upload</Link>
                    </div>
                </div>
            )}
        </header>
    );
}
