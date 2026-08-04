import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Mail, Phone, MapPin, Calendar, Shield, ShieldCheck, Key,
    Lock, Smartphone, Upload, Edit3, CheckCircle, XCircle, Clock3,
    FileText, Eye, EyeOff, ChevronRight, Camera, Activity, Star,
    AlertTriangle, Settings, UploadCloud, Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import toast from 'react-hot-toast';
import api from '../../services/api';



// ---- PROGRESS CIRCLE ----
const ProgressCircle = ({ pct, size = 120, stroke = 8 }) => {
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;
    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
                <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e293b" strokeWidth={stroke}
                    strokeLinecap="round" strokeDasharray={circ}
                    initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.4, ease: "easeOut" }} />
            </svg>
            <div className="absolute text-center">
                <p className="text-2xl font-black text-slate-800">{pct}%</p>
                <p className="text-[10px] text-slate-400 uppercase">Done</p>
            </div>
        </div>
    );
};

// ---- EDIT PROFILE MODAL ----
const EditProfileModal = ({ userData, onClose, onSave }) => {
    // Initialized exactly with backend fields
    const [form, setForm] = useState({
        firstName: userData?.firstName || '',
        lastName: userData?.lastName || '',
        mobileNumber: userData?.mobileNumber || '',
        dob: userData?.dob || '',
        gender: userData?.gender || '',
        address: userData?.address || '',
        city: userData?.city || '',
        state: userData?.state || '',
        country: userData?.country || '',
        pincode: userData?.pincode || '',
    });
    
    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <h2 className="font-bold text-slate-800">Edit Profile</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-200 transition"><XCircle size={20}/></button>
                </div>
                <div className="p-6 overflow-y-auto space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {[["firstName","First Name"],["lastName","Last Name"]].map(([n,l]) => (
                            <div key={n}><label className="block text-xs font-medium text-slate-600 mb-1">{l}</label>
                            <input name={n} value={form[n]} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50 focus:bg-white" /></div>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Mobile Number</label>
                            <input name="mobileNumber" value={form.mobileNumber} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50 focus:bg-white" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Date of Birth</label>
                            <input type="date" name="dob" value={form.dob} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50 focus:bg-white" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-xs font-medium text-slate-600 mb-1">Gender</label>
                            <select name="gender" value={form.gender} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50 focus:bg-white">
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Address</label>
                        <input name="address" value={form.address} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50 focus:bg-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[["city","City"],["state","State"],["country","Country"],["pincode","Pincode"]].map(([n,l]) => (
                            <div key={n}><label className="block text-xs font-medium text-slate-600 mb-1">{l}</label>
                            <input name={n} value={form[n]} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50 focus:bg-white" /></div>
                        ))}
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
                    <button onClick={onClose} className="flex-1 bg-white border border-slate-200 text-slate-700 py-2.5 rounded-xl font-medium hover:bg-slate-50 transition text-sm">Cancel</button>
                    <button onClick={() => onSave(form)} className="flex-1 bg-slate-900 text-white py-2.5 rounded-xl font-medium hover:bg-slate-800 transition text-sm">Save Changes</button>
                </div>
            </motion.div>
        </div>
    );
};

// ---- CHANGE PASSWORD MODAL ----
const ChangePasswordModal = ({ onClose }) => {
    const [show, setShow] = useState({ cur: false, nw: false, cf: false });
    const [pwd, setPwd] = useState({ cur: '', nw: '', cf: '' });
    const strength = pwd.nw.length >= 12 ? "Strong" : pwd.nw.length >= 8 ? "Medium" : pwd.nw.length > 0 ? "Weak" : "";
    const strengthColor = { Strong: "text-green-600", Medium: "text-yellow-600", Weak: "text-red-500" };
    const strengthBar = { Strong: "w-full bg-green-500", Medium: "w-2/3 bg-yellow-500", Weak: "w-1/3 bg-red-500" };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <h2 className="font-bold text-slate-800">Change Password</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-200 transition"><XCircle size={20}/></button>
                </div>
                <div className="p-6 space-y-4">
                    {[["cur","Current Password","cur"],["nw","New Password","nw"],["cf","Confirm New Password","cf"]].map(([k,label,key]) => (
                        <div key={k}>
                            <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
                            <div className="relative">
                                <input type={show[key] ? "text" : "password"} value={pwd[key]} onChange={e => setPwd(p => ({...p,[key]:e.target.value}))}
                                    className="w-full px-3 py-2 pr-10 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50 focus:bg-white" />
                                <button type="button" onClick={() => setShow(s => ({...s,[key]:!s[key]}))} className="absolute right-3 top-2.5 text-slate-400">
                                    {show[key] ? <EyeOff size={16}/> : <Eye size={16}/>}
                                </button>
                            </div>
                        </div>
                    ))}
                    {strength && (
                        <div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all ${strengthBar[strength]}`}></div></div>
                            <p className={`text-xs font-semibold mt-1 ${strengthColor[strength]}`}>{strength} Password</p>
                        </div>
                    )}
                </div>
                <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
                    <button onClick={onClose} className="flex-1 bg-white border border-slate-200 text-slate-700 py-2.5 rounded-xl font-medium hover:bg-slate-50 transition text-sm">Cancel</button>
                    <button onClick={onClose} className="flex-1 bg-slate-900 text-white py-2.5 rounded-xl font-medium hover:bg-slate-800 transition text-sm">Update Password</button>
                </div>
            </motion.div>
        </div>
    );
};

// ---- MAIN PAGE ----
const Profile = () => {
    const [isLoading, setIsLoading]     = useState(true);
    const [showEdit, setShowEdit]       = useState(false);
    const [showPwd, setShowPwd]         = useState(false);
    const [photo, setPhoto]             = useState(null);
    const [userData, setUserData]       = useState(null);
    const photoRef = useRef(null);

    const fetchProfile = async () => {
        setIsLoading(true);
        try {
            const [profileRes, dashboardRes] = await Promise.all([
                api.get('/users/profile'),
                api.get('/users/dashboard').catch(() => ({ data: {} })) // fallback if dashboard fails
            ]);
            
            const data = profileRes.data;
            const stats = dashboardRes.data || {};

            // Calculate completeness
            let filledFields = 0;
            const fieldsToCheck = ['firstName', 'lastName', 'mobileNumber', 'dob', 'gender', 'address', 'city', 'state', 'country', 'pincode'];
            fieldsToCheck.forEach(f => { if (data[f]) filledFields++; });
            const completeness = Math.round((filledFields / fieldsToCheck.length) * 100);

            setUserData({
                ...data,
                fullName: `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.username || 'User',
                userId: `USR-2026-${data.id || '0000'}`,
                isPremium: data.isPremium,
                plan: data.isPremium ? "Premium" : "Free Plan",
                location: data.city || data.state ? `${data.city || ''}, ${data.state || ''}`.replace(/^, |^,$/, '') : 'No location added',
                avatarInitials: data.firstName ? data.firstName[0].toUpperCase() : (data.username ? data.username[0].toUpperCase() : "U"),
                completeness: completeness,
                docs: { 
                    total: stats.totalDocuments || 0, 
                    approved: stats.approvedDocuments || 0, 
                    pending: stats.pendingDocuments || 0, 
                    rejected: stats.rejectedDocuments || 0 
                }
            });

            if (data.profileImageUrl) {
                setPhoto(`http://localhost:8080/api/users/profile/image/${data.id}?t=${new Date().getTime()}`);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleSaveProfile = async (updatedForm) => {
        try {
            await api.put('/users/profile', updatedForm);
            await fetchProfile();
            setShowEdit(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Check the fields.");
        }
    };

    const handlePhoto = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(URL.createObjectURL(file)); // Optimistic UI update
            const formData = new FormData();
            formData.append('file', file);
            try {
                await api.post('/users/profile/image', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                await fetchProfile();
            } catch (error) {
                console.error("Error uploading profile image:", error);
                alert("Failed to upload profile image.");
                setPhoto(null);
            }
        }
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleUpgrade = async () => {
        const res = await loadRazorpay();
        if (!res) {
            toast.error("Razorpay SDK failed to load. Are you online?");
            return;
        }

        try {
            const { default: api } = await import('../../services/api');
            
            // 1. Create Order on Backend
            const orderRes = await api.post('/payment/create-order');
            
            // 2. Configure Razorpay Options
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Frontend .env key
                amount: orderRes.data.amount,
                currency: orderRes.data.currency,
                name: "Document Centralizer",
                description: "Lifetime Premium Subscription",
                order_id: orderRes.data.orderId,
                handler: async function (response) {
                    try {
                        // 3. Verify Payment on Backend
                        const verifyRes = await api.post('/payment/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        
                        if (verifyRes.data.status === "SUCCESS") {
                            toast.success("Welcome to Premium! You now have unlimited uploads.");
                            fetchProfile(); // Refresh profile to show Premium UI
                        }
                    } catch (err) {
                        toast.error("Payment verification failed.");
                    }
                },
                prefill: {
                    name: userData?.fullName || "User",
                    email: userData?.email || "user@example.com",
                },
                theme: {
                    color: "#3399cc"
                }
            };
            
            // 3. Open Razorpay Checkout
            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (err) {
            console.error(err);
            toast.error("Failed to initialize payment. Try again.");
        }
    };

    if (isLoading || !userData) {
        return (
            <div className="max-w-7xl mx-auto space-y-6 pb-16 p-4">
                <div className="space-y-6">
                    {[1,2,3].map(i => <div key={i} className="h-40 bg-slate-100 animate-pulse rounded-2xl"></div>)}
                </div>
            </div>
        );
    }

    const d = userData.docs;

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-16">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage your personal information, security settings and account details.</p>
                </div>
                <motion.button whileHover={{ scale: 1.03 }} onClick={() => setShowEdit(true)}
                    className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-slate-800 transition shadow-sm">
                    <Edit3 size={16} /> Edit Profile
                </motion.button>
            </div>

            {/* Profile Hero Card */}
            <Card className="overflow-hidden">
                <div className="h-28 bg-gradient-to-r from-slate-800 to-slate-900 relative">
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
                </div>
                <CardContent className="px-8 pb-8 -mt-14 relative z-10">
                    <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                        {/* Avatar */}
                        <div className="relative group">
                            <div className="w-28 h-28 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-slate-900 flex items-center justify-center cursor-pointer"
                                onClick={() => photoRef.current.click()}>
                                {photo ? <img src={photo} alt="avatar" className="w-full h-full object-cover" />
                                    : <span className="text-3xl font-black text-white">{userData.avatarInitials}</span>}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                                    <Camera size={24} className="text-white" />
                                </div>
                            </div>
                            <button onClick={() => photoRef.current.click()}
                                className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-700 transition">
                                <Upload size={14} />
                            </button>
                            <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                        </div>
                        {/* Info */}
                        <div className="flex-1 pt-4 md:pt-0">
                            <div className="flex flex-wrap items-center gap-3 mb-1">
                                <h2 className="text-2xl font-black text-slate-800">{userData.fullName}</h2>
                                <span className="flex items-center gap-1 bg-green-100 text-green-700 border border-green-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                    <ShieldCheck size={12}/> Verified
                                </span>
                                {userData.isPremium && (
                                    <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 border border-yellow-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                        <Star size={12}/> Premium
                                    </span>
                                )}
                            </div>
                            <p className="text-slate-500 text-sm">{userData.email}</p>
                            <div className="flex flex-wrap gap-6 mt-4 text-sm text-slate-500">
                                <span className="flex items-center gap-1.5"><User size={14}/> {userData.role || 'USER'}</span>
                                <span className="flex items-center gap-1.5"><MapPin size={14}/> {userData.location}</span>
                            </div>
                        </div>
                        {/* Stats Quick */}
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                [d.total, "Total", "text-slate-800"],
                                [d.approved, "Approved", "text-green-700"],
                                [d.pending, "Pending", "text-yellow-700"],
                                [d.rejected, "Rejected", "text-red-700"]
                            ].map(([v,l,c]) => (
                                <div key={l} className="text-center bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                                    <p className={`text-xl font-black ${c}`}>{v}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{l}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Main Grid */}
            <div className="flex flex-col xl:flex-row gap-6">
                {/* LEFT — Personal Info, Account Info, Security, Activity */}
                <div className="flex-1 space-y-6">

                    {/* Personal Information */}
                    <Card>
                        <CardHeader title="Personal Information" action={
                            <button onClick={() => setShowEdit(true)} className="flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:text-blue-700"><Edit3 size={14}/> Edit</button>
                        }/>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {[
                                { label: "First Name",    value: userData.firstName,      icon: User },
                                { label: "Last Name",     value: userData.lastName,       icon: User },
                                { label: "Email",         value: userData.email,          icon: Mail },
                                { label: "Mobile Number", value: userData.mobileNumber,   icon: Phone },
                                { label: "Date of Birth", value: userData.dob,            icon: Calendar },
                                { label: "Gender",        value: userData.gender,         icon: User },
                                { label: "Address",       value: userData.address,        icon: MapPin },
                                { label: "City",          value: userData.city,           icon: MapPin },
                                { label: "State",         value: userData.state,          icon: MapPin },
                                { label: "Country",       value: userData.country,        icon: MapPin },
                                { label: "Pincode",       value: userData.pincode,        icon: MapPin },
                            ].map((item, i) => (
                                <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-1"><item.icon size={12}/> {item.label}</p>
                                    <p className="text-sm font-semibold text-slate-800">{item.value || '-'}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Account Information */}
                    <Card>
                        <CardHeader title="Account Information" />
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {[
                                { label: "User ID",           value: userData.userId },
                                { label: "Username",          value: userData.username || '-' },
                                { label: "Role",              value: userData.role || 'USER' },
                                { label: "Account Status",    value: "Active" },
                            ].map((item, i) => (
                                <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                                    <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                                    <p className="text-sm font-semibold text-slate-800">{item.value}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>



                </div>

                {/* RIGHT SIDEBAR */}
                <div className="w-full xl:w-80 space-y-6">

                    {/* Profile Completeness */}
                    <Card>
                        <CardHeader title="Profile Completeness" />
                        <CardContent className="pt-0 flex flex-col items-center gap-4">
                            <ProgressCircle pct={userData.completeness} />
                            <div className="w-full space-y-2">
                                <p className="text-sm font-semibold text-slate-700">To improve, add:</p>
                                {userData.completeness < 100 && (
                                    <div className="flex items-center gap-2 text-xs text-slate-500 p-2 bg-slate-50 rounded-lg border border-slate-100 mt-2">
                                        <AlertTriangle size={14} className="text-amber-500 shrink-0"/> Complete your profile by editing it!
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Account Summary */}
                    <Card>
                        <CardHeader title="Account Summary" />
                        <CardContent className="pt-0 space-y-3">
                            {[
                                { label: "Total Documents", value: d.total, color: "text-slate-800" },
                                { label: "Approved",        value: d.approved, color: "text-green-700" },
                                { label: "Pending",         value: d.pending,  color: "text-yellow-700" },
                                { label: "Rejected",        value: d.rejected, color: "text-red-700" },
                            ].map((r, i) => (
                                <div key={i} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                                    <span className="text-sm text-slate-500">{r.label}</span>
                                    <span className={`text-lg font-black ${r.color}`}>{r.value}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>


                    {/* Subscription Card */}
                    <Card>
                        <CardHeader title="Subscription" />
                        <CardContent className="pt-0 space-y-4">
                            {userData.isPremium ? (
                                <div className="bg-slate-900 rounded-xl p-4 text-white">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="flex items-center gap-1.5 text-yellow-400 text-xs font-bold uppercase"><Star size={12}/> Premium</span>
                                        <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Active</span>
                                    </div>
                                    <p className="text-xl font-black">Lifetime Access</p>
                                    <p className="text-xs text-slate-400 mt-1">Unlimited uploads unlocked</p>
                                </div>
                            ) : (
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="flex items-center gap-1.5 text-slate-700 text-xs font-bold uppercase"><User size={12}/> Free Plan</span>
                                        <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">Current</span>
                                    </div>
                                    <p className="text-xl font-black text-slate-800">Max 5 Documents</p>
                                    <p className="text-xs text-slate-500 mt-1">Upgrade for unlimited access</p>
                                    <button onClick={handleUpgrade} className="w-full mt-4 bg-slate-900 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 transition">
                                        Upgrade Now - ₹99
                                    </button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader title="Quick Actions" />
                        <CardContent className="pt-0 space-y-2">
                            {[
                                { label: "Upload Document",  icon: UploadCloud, to: "/user/upload" },
                                { label: "My Documents",     icon: FileText,    to: "/user/my-documents" },
                                { label: "Subscription",     icon: Star,        to: "/user/subscription" },
                                { label: "Settings",         icon: Settings,    to: "/user/settings" },
                            ].map((a, i) => (
                                <Link key={i} to={a.to} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100 group">
                                    <span className="flex items-center gap-3 text-sm font-medium text-slate-700">
                                        <a.icon size={16} className="text-slate-400 group-hover:text-slate-700" /> {a.label}
                                    </span>
                                    <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500"/>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>

                </div>
            </div>

            {/* MODALS */}
            <AnimatePresence>
                {showEdit && <EditProfileModal userData={userData} onSave={handleSaveProfile} onClose={() => setShowEdit(false)} />}
                {showPwd  && <ChangePasswordModal onClose={() => setShowPwd(false)} />}
            </AnimatePresence>
        </div>
    );
};

export default Profile;
