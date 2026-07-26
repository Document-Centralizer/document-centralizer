
import { useState, useRef, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, Bell, HelpCircle, ChevronDown, X, Plus, User, Settings,
    FileText, CreditCard, Shield, LogOut, LayoutDashboard, Upload,
    Share2, Zap, BookOpen, MessageCircle, AlertCircle, Check,
    Globe, Moon, Sun, Monitor, Clock, ShieldCheck, Command, Menu,
    ChevronRight, ExternalLink
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

// ─── DUMMY DATA ────────────────────────────────────────────────
const NOTIFICATIONS = [
    { id:1, title:"Document Approved",      desc:"Your Passport.pdf has been verified.",          time:"2 min ago",  read:false, type:"approve" },
    { id:2, title:"Document Rejected",      desc:"Your Marksheet requires correction.",            time:"1 hour ago", read:false, type:"reject" },
    { id:3, title:"Subscription Renewal",   desc:"Your Premium plan expires on 25 Aug 2026.",     time:"3 hours ago",read:false, type:"billing" },
    { id:4, title:"New Login Detected",     desc:"A new device login was detected in Pune.",      time:"Yesterday",  read:true,  type:"security" },
    { id:5, title:"Document Uploaded",      desc:"Degree_Certificate.pdf uploaded successfully.", time:"2 days ago", read:true,  type:"upload" },
];

const SEARCH_DATA = [
    { id:1, name:"Passport.pdf",            category:"Document", status:"Approved",  path:"/user/approved" },
    { id:2, name:"Degree Certificate.pdf",  category:"Document", status:"Pending",   path:"/user/pending" },
    { id:3, name:"Aadhaar_Card.pdf",        category:"Document", status:"Approved",  path:"/user/approved" },
    { id:4, name:"PAN_Card.pdf",            category:"Document", status:"Rejected",  path:"/user/rejected" },
    { id:5, name:"Driving_License.jpg",     category:"Document", status:"Pending",   path:"/user/pending" },
];

const RECENT_SEARCHES = ["Passport.pdf", "Degree Certificate", "User Profile"];

const ROUTE_LABELS = {
    "/user":                "Dashboard",
    "/user/upload":         "Upload Document",
    "/user/my-documents":   "My Documents",
    "/user/pending":        "Pending Documents",
    "/user/approved":       "Approved Documents",
    "/user/rejected":       "Rejected Documents",
    "/user/subscription":   "My Subscription",
    "/user/profile":        "My Profile",
    "/user/settings":       "Account Settings",
    "/admin":               "Admin Dashboard",
    "/superadmin":          "Super Admin Dashboard",
};

// ─── HELPERS ───────────────────────────────────────────────────
const notifColor = { approve:"bg-green-100 text-green-600", reject:"bg-red-100 text-red-600", billing:"bg-yellow-100 text-yellow-700", security:"bg-purple-100 text-purple-600", upload:"bg-blue-100 text-blue-600" };
const notifIcon  = { approve: Check, reject: X, billing: CreditCard, security: Shield, upload: Upload };

const statusColor = { Approved:"bg-green-100 text-green-700", Pending:"bg-yellow-100 text-yellow-700", Rejected:"bg-red-100 text-red-700" };

// ─── DROPDOWN WRAPPER ──────────────────────────────────────────
const DropdownWrapper = ({ children, open, onClose }) => {
    const ref = useRef(null);
    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
        if (open) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open, onClose]);
    return <div ref={ref} className="relative">{children}</div>;
};

// ─── NOTIFICATION DROPDOWN ─────────────────────────────────────
const NotificationDropdown = () => {
    const [open, setOpen] = useState(false);
    const [notifs, setNotifs] = useState(NOTIFICATIONS);
    const unread = notifs.filter(n => !n.read).length;

    const markAll = () => setNotifs(n => n.map(x => ({...x, read:true})));
    const markOne = (id) => setNotifs(n => n.map(x => x.id===id ? {...x,read:true} : x));

    return (
        <DropdownWrapper open={open} onClose={() => setOpen(false)}>
            <button onClick={() => setOpen(!open)} className="relative p-2.5 rounded-xl hover:bg-slate-100 text-slate-500 transition">
                <Bell size={20} />
                {unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold min-w-[18px] h-[18px] rounded-full border-2 border-white flex items-center justify-center px-1">
                        {unread}
                    </span>
                )}
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div initial={{ opacity:0, y:10, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:10, scale:0.97 }}
                        className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-slate-800">Notifications</h3>
                                <p className="text-xs text-slate-500 mt-0.5">{unread} unread</p>
                            </div>
                            {unread > 0 && (
                                <button onClick={markAll} className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                    <Check size={13}/> Mark all read
                                </button>
                            )}
                        </div>
                        <div className="max-h-[360px] overflow-y-auto">
                            {notifs.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                                    <Bell size={32} className="mb-2 opacity-40"/>
                                    <p className="text-sm">No new notifications</p>
                                </div>
                            ) : notifs.map(n => {
                                const Icon = notifIcon[n.type] || Bell;
                                return (
                                    <div key={n.id} onClick={() => markOne(n.id)}
                                        className={`flex items-start gap-3 px-5 py-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition ${!n.read ? 'bg-blue-50/40' : ''}`}>
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${notifColor[n.type]}`}>
                                            <Icon size={16}/>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className={`text-sm font-semibold ${!n.read ? 'text-slate-900' : 'text-slate-600'}`}>{n.title}</p>
                                                {!n.read && <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5"></div>}
                                            </div>
                                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.desc}</p>
                                            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1"><Clock size={10}/> {n.time}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
                            <Link to="/user" onClick={() => setOpen(false)} className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center justify-center gap-1.5">
                                View all notifications <ChevronRight size={14}/>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </DropdownWrapper>
    );
};

// ─── SEARCH BAR ────────────────────────────────────────────────
const SearchBar = () => {
    const [query, setQuery]   = useState("");
    const [open, setOpen]     = useState(false);
    const [focused, setFocused] = useState(false);
    const navigate = useNavigate();
    const inputRef = useRef(null);

    const results = query.length >= 1
        ? SEARCH_DATA.filter(d => d.name.toLowerCase().includes(query.toLowerCase()))
        : [];

    // Ctrl+K shortcut
    useEffect(() => {
        const handler = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                inputRef.current?.focus();
                setOpen(true);
            }
            if (e.key === "Escape") { setOpen(false); setQuery(""); inputRef.current?.blur(); }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    const goTo = (path) => { navigate(path); setOpen(false); setQuery(""); };

    return (
        <div className="relative hidden md:block">
            <div className={`flex items-center gap-2 px-3 py-2 border rounded-xl transition-all ${focused ? 'border-slate-400 ring-2 ring-slate-900/10 bg-white' : 'border-slate-200 bg-slate-50'}`}
                style={{ width: focused ? 380 : 280 }}>
                <Search size={16} className="text-slate-400 shrink-0" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={e => { setQuery(e.target.value); setOpen(true); }}
                    onFocus={() => { setFocused(true); setOpen(true); }}
                    onBlur={() => setTimeout(() => { setFocused(false); setOpen(false); }, 200)}
                    placeholder="Search documents, files..."
                    className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
                />
                {query ? (
                    <button onClick={() => setQuery("")} className="text-slate-400 hover:text-slate-600"><X size={14}/></button>
                ) : (
                    <kbd className="hidden lg:flex items-center gap-0.5 text-[10px] text-slate-400 bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 font-mono">
                        <Command size={10}/> K
                    </kbd>
                )}
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:8 }}
                        className="absolute top-full left-0 mt-2 w-full min-w-[380px] bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden">
                        {query === "" ? (
                            <div className="p-4">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Recent Searches</p>
                                <div className="space-y-1">
                                    {RECENT_SEARCHES.map((s, i) => (
                                        <button key={i} onClick={() => setQuery(s)} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 text-sm text-slate-600 transition">
                                            <Clock size={14} className="text-slate-400"/> {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : results.length > 0 ? (
                            <div className="p-2">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 pt-2 pb-2">Results</p>
                                {results.map(r => (
                                    <button key={r.id} onClick={() => goTo(r.path)} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 transition group">
                                        <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition">
                                            <FileText size={16}/>
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="text-sm font-semibold text-slate-800">{r.name}</p>
                                            <p className="text-xs text-slate-500">{r.category}</p>
                                        </div>
                                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold border ${statusColor[r.status] || 'bg-slate-100 text-slate-600'}`}>{r.status}</span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                                <Search size={28} className="mb-2 opacity-40"/>
                                <p className="text-sm font-medium">No results for "{query}"</p>
                                <p className="text-xs mt-1">Try searching with different keywords</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ─── THEME TOGGLE ──────────────────────────────────────────────
const ThemeToggle = () => {
    const [open, setOpen] = useState(false);
    const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "Light");
    const options = [["Light", Sun], ["Dark", Moon], ["System Default", Monitor]];
    
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        if (theme === 'System Default') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme.toLowerCase());
        }
    }, [theme]);

    const selectTheme = (t) => { setTheme(t); localStorage.setItem("theme", t); setOpen(false); };
    const Icon = options.find(([t]) => t === theme)?.[1] || Sun;

    return (
        <DropdownWrapper open={open} onClose={() => setOpen(false)}>
            <button onClick={() => setOpen(!open)} className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-500 transition">
                <Icon size={18}/>
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div initial={{ opacity:0, y:10, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:10, scale:0.97 }}
                        className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                        {options.map(([t, Ic]) => (
                            <button key={t} onClick={() => selectTheme(t)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition ${theme===t ? 'text-slate-900 font-semibold bg-slate-50' : 'text-slate-600 hover:bg-slate-50'}`}>
                                <Ic size={16} className={theme===t ? 'text-slate-900' : 'text-slate-400'}/>
                                {t}
                                {theme===t && <Check size={14} className="ml-auto text-green-500"/>}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </DropdownWrapper>
    );
};

// ─── LANGUAGE SELECTOR ─────────────────────────────────────────
const LanguageSelector = () => {
    const [open, setOpen] = useState(false);
    const [lang, setLang] = useState("EN");
    const langs = [["EN","English"],["HI","Hindi"],["MR","Marathi"]];
    return (
        <DropdownWrapper open={open} onClose={() => setOpen(false)}>
            <button onClick={() => setOpen(!open)} className="flex items-center gap-1.5 p-2.5 rounded-xl hover:bg-slate-100 text-slate-500 transition">
                <Globe size={18}/> <span className="text-xs font-bold text-slate-600">{lang}</span>
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div initial={{ opacity:0, y:10, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:10, scale:0.97 }}
                        className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                        {langs.map(([code, label]) => (
                            <button key={code} onClick={() => { setLang(code); setOpen(false); }}
                                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition ${lang===code ? 'font-semibold text-slate-900 bg-slate-50' : 'text-slate-600 hover:bg-slate-50'}`}>
                                {label} {lang===code && <Check size={13} className="text-green-500"/>}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </DropdownWrapper>
    );
};

// ─── HELP DROPDOWN ─────────────────────────────────────────────
const HelpDropdown = () => {
    const [open, setOpen] = useState(false);
    const items = [
        { label:"Documentation",  icon: BookOpen,      href:"#" },
        { label:"FAQs",           icon: HelpCircle,    href:"#" },
        { label:"Contact Support",icon: MessageCircle, href:"#" },
        { label:"Report Issue",   icon: AlertCircle,   href:"#" },
    ];
    return (
        <DropdownWrapper open={open} onClose={() => setOpen(false)}>
            <button onClick={() => setOpen(!open)} className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-500 transition">
                <HelpCircle size={18}/>
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div initial={{ opacity:0, y:10, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:10, scale:0.97 }}
                        className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                        <div className="px-4 py-2 border-b border-slate-100 mb-1">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Help & Support</p>
                        </div>
                        {items.map(({ label, icon: Icon, href }) => (
                            <a key={label} href={href} onClick={() => setOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition">
                                <Icon size={15} className="text-slate-400"/> {label}
                            </a>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </DropdownWrapper>
    );
};

// ─── QUICK CREATE MENU ─────────────────────────────────────────
const QuickCreateMenu = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const items = [
        { label:"Upload Document",      icon: Upload,  path:"/user/upload" },
        { label:"Generate Share Link",  icon: Share2,  path:"/user/approved" },
        { label:"Upgrade Subscription", icon: Zap,     path:"/user/subscription" },
    ];
    return (
        <DropdownWrapper open={open} onClose={() => setOpen(false)}>
            <motion.button whileHover={{ scale:1.03 }} onClick={() => setOpen(!open)}
                className="flex items-center gap-1.5 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-800 transition shadow-sm">
                <Plus size={16}/> <span className="hidden sm:inline">Create</span>
            </motion.button>
            <AnimatePresence>
                {open && (
                    <motion.div initial={{ opacity:0, y:10, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:10, scale:0.97 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                        {items.map(({ label, icon: Icon, path }) => (
                            <button key={label} onClick={() => { navigate(path); setOpen(false); }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition font-medium">
                                <Icon size={16} className="text-slate-400"/> {label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </DropdownWrapper>
    );
};

// ─── PROFILE DROPDOWN ─────────────────────────────────────────
const ProfileDropdown = ({ user }) => {
    const [open, setOpen] = useState(false);
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const prefix = `/${user?.role || 'user'}`;
    const menuItems = [
        { label:"My Profile",       icon: User,          path:`${prefix}/profile` },
        { label:"Account Settings", icon: Settings,      path:`${prefix}/settings` },
        { label:"My Documents",     icon: FileText,       path:`${prefix}/my-documents` },
        { label:"My Subscription",  icon: CreditCard,    path:`${prefix}/subscription` },
        { label:"Security Settings",icon: Shield,        path:`${prefix}/settings` },
        { label:"Help Center",      icon: HelpCircle,    path:`${prefix}/help` },
    ];
    const handleLogout = () => { setOpen(false); logout(); navigate("/login"); };

    return (
        <DropdownWrapper open={open} onClose={() => setOpen(false)}>
            <button onClick={() => setOpen(!open)}
                className="flex items-center gap-2.5 hover:bg-slate-50 px-2.5 py-1.5 rounded-xl border border-transparent hover:border-slate-200 transition">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-slate-800 leading-tight">{user?.name || "User"}</p>
                    <p className="text-[10px] text-slate-400 capitalize">{user?.role || "user"}</p>
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}/>
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div initial={{ opacity:0, y:10, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:10, scale:0.97 }}
                        className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden">
                        {/* Profile mini card */}
                        <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-lg">
                                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-slate-800 text-sm">{user?.name || "Vaibhav Khot"}</p>
                                        <span className="flex items-center gap-0.5 text-[9px] font-bold bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full border border-yellow-200">⭐ Premium</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-0.5">{user?.email || "vaibhav@example.com"}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <ShieldCheck size={11} className="text-green-500"/>
                                        <span className="text-[10px] text-green-600 font-semibold">Verified Account</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Menu items */}
                        <div className="py-2">
                            {menuItems.map(({ label, icon: Icon, path }) => (
                                <Link key={label} to={path} onClick={() => setOpen(false)}
                                    className="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition">
                                    <Icon size={16} className="text-slate-400"/> {label}
                                </Link>
                            ))}
                        </div>
                        <div className="border-t border-slate-100 py-2">
                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-red-600 hover:bg-red-50 transition font-medium">
                                <LogOut size={16} className="text-red-400"/> Sign Out
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </DropdownWrapper>
    );
};

// ─── MOBILE MENU ───────────────────────────────────────────────
const MobileMenu = ({ user }) => {
    const [open, setOpen] = useState(false);
    const prefix = `/${user?.role || 'user'}`;
    const items = [
        { label:"Dashboard",       icon: LayoutDashboard, path:`${prefix}` },
        { label:"My Documents",    icon: FileText,         path:`${prefix}/my-documents` },
        { label:"Upload Document", icon: Upload,           path:`${prefix}/upload` },
        { label:"Subscription",    icon: CreditCard,       path:`${prefix}/subscription` },
        { label:"Profile",         icon: User,             path:`${prefix}/profile` },
        { label:"Settings",        icon: Settings,         path:`${prefix}/settings` },
    ];
    return (
        <div className="md:hidden">
            <button onClick={() => setOpen(!open)} className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-600 transition">
                <Menu size={20}/>
            </button>
            <AnimatePresence>
                {open && (
                    <>
                        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                            className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40" onClick={() => setOpen(false)}/>
                        <motion.div initial={{ x:"-100%" }} animate={{ x:0 }} exit={{ x:"-100%" }} transition={{ type:"tween", duration:0.25 }}
                            className="fixed left-0 top-0 h-full w-72 bg-white z-50 shadow-2xl flex flex-col">
                            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black text-sm">DC</div>
                                    <span className="font-bold text-slate-800">DocCentralizer</span>
                                </div>
                                <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500"><X size={18}/></button>
                            </div>
                            <div className="px-5 py-4 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">{user?.name?.charAt(0) || "U"}</div>
                                    <div><p className="font-semibold text-slate-800 text-sm">{user?.name || "User"}</p><p className="text-xs text-slate-400 capitalize">{user?.role}</p></div>
                                </div>
                            </div>
                            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                                {items.map(({ label, icon: Icon, path }) => (
                                    <Link key={label} to={path} onClick={() => setOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition">
                                        <Icon size={18} className="text-slate-400"/> {label}
                                    </Link>
                                ))}
                            </nav>
                            <div className="p-4 border-t border-slate-100">
                                <button onClick={() => setOpen(false)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition">
                                    <LogOut size={18} className="text-red-400"/> Sign Out
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

// ─── BREADCRUMB ────────────────────────────────────────────────
const Breadcrumb = () => {
    const location = useLocation();
    const current = ROUTE_LABELS[location.pathname] || "Page";
    const role = location.pathname.startsWith("/admin") ? "Admin" : location.pathname.startsWith("/superadmin") ? "Super Admin" : "User";
    return (
        <div className="hidden md:flex items-center gap-2 text-sm bg-slate-50/80 px-3.5 py-1.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-medium capitalize tracking-wide text-xs">{role} Portal</span>
            <ChevronRight size={14} className="text-slate-300"/>
            <span className="font-semibold text-slate-700">{current}</span>
        </div>
    );
};

// ─── MAIN NAVBAR ───────────────────────────────────────────────
const Navbar = () => {
    const { user } = useContext(AuthContext);

    return (
        <header className="h-[72px] bg-white/90 backdrop-blur-xl border-b border-slate-200/80 px-4 md:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-40 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] transition-all">
            {/* LEFT & CENTER */}
            <div className="flex items-center gap-3 lg:gap-5 flex-1">
                <MobileMenu user={user} />
                <div className="w-full max-w-xl">
                    <SearchBar />
                </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center justify-end gap-2 md:gap-4 lg:gap-5 shrink-0">
                <div className="flex items-center gap-2">
                    <QuickCreateMenu />
                    
                    <div className="hidden lg:flex items-center">
                        <ThemeToggle />
                    </div>
                </div>

                <div className="hidden md:block w-px h-7 bg-slate-200 mx-1"></div>

                <div className="flex items-center gap-2 md:gap-3">
                    <NotificationDropdown />
                    <ProfileDropdown user={user} />
                </div>
            </div>
        </header>
    );
};

export default Navbar;
