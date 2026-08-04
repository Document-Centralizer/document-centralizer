import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Zap, Check, Star, User, ShieldCheck, UploadCloud
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import toast from 'react-hot-toast';

const features = [
    "Unlimited Document Upload", "Priority Verification", "Unlimited Share Links",
    "QR Code Verification", "Digital Document Locker", "Secure Cloud Backup",
    "Faster Verification", "Download Verified Documents", "Multi Device Access", "Document History"
];

const Subscription = () => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const fetchProfile = async () => {
        setIsLoading(true);
        try {
            const { getUserData } = await import('../../utils/localStorage');
            const { default: api } = await import('../../services/api');
            const user = getUserData();
            
            if (!user || !user.email) {
                console.error("No user found in local storage");
                return;
            }

            const response = await api.get(`/users/profile?email=${user.email}`);
            const data = response.data;
            setUserData({
                ...data,
                isPremium: data.isPremium || false
            });
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

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
        if (userData?.isPremium) {
            toast("You are already on the Premium plan!", { icon: "⭐️" });
            return;
        }

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
                key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
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
                            fetchProfile(); // Refresh to hide upgrade buttons
                        }
                    } catch (err) {
                        toast.error("Payment verification failed.");
                    }
                },
                prefill: {
                    name: userData?.firstName || "User",
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
                    <div className="h-40 bg-slate-100 animate-pulse rounded-2xl"></div>
                </div>
            </div>
        );
    }

    const plans = [
        {
            name: "Free",
            price: "₹0",
            cycle: "Forever",
            badge: null,
            features: ["10 Document Uploads", "Basic Verification", "Limited Sharing"],
            cta: userData.isPremium ? "Downgrade (Not Available)" : "Current Plan",
            highlight: false,
            isCurrent: !userData.isPremium,
            action: null
        },
        {
            name: "Premium",
            price: "₹99",
            cycle: "Lifetime",
            badge: "Most Popular",
            features: ["Unlimited Uploads", "Priority Verification", "Unlimited Sharing", "QR Verification", "Cloud Backup"],
            cta: userData.isPremium ? "Current Plan" : "Upgrade to Premium",
            highlight: true,
            isCurrent: userData.isPremium,
            action: !userData.isPremium ? handleUpgrade : null
        }
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-16">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Subscription</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage your current plan and view features.</p>
                </div>
                {!userData.isPremium && (
                    <motion.button 
                        whileHover={{ scale: 1.03 }} 
                        onClick={handleUpgrade}
                        className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-slate-800 transition shadow-sm"
                    >
                        <Zap size={16} /> Upgrade Plan
                    </motion.button>
                )}
            </div>

            {/* Current Plan Card */}
            <Card className="relative overflow-hidden">
                {userData.isPremium ? (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl"></div>
                ) : (
                    <div className="absolute inset-0 bg-slate-50 rounded-2xl border border-slate-200"></div>
                )}
                
                <CardContent className={`relative z-10 p-8 flex flex-col gap-6 ${userData.isPremium ? 'text-white' : 'text-slate-800'}`}>
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                {userData.isPremium ? (
                                    <>
                                        <Star size={20} className="text-yellow-400 fill-yellow-400" />
                                        <span className="text-yellow-400 font-semibold text-sm uppercase tracking-wider">Premium Plan</span>
                                    </>
                                ) : (
                                    <>
                                        <User size={20} className="text-slate-500" />
                                        <span className="text-slate-600 font-semibold text-sm uppercase tracking-wider">Free Plan</span>
                                    </>
                                )}
                            </div>
                            <h2 className={`text-3xl font-black ${userData.isPremium ? 'text-white' : 'text-slate-900'}`}>
                                {userData.isPremium ? 'Lifetime Access' : 'Limited Access'}
                            </h2>
                            <p className={`text-sm mt-2 ${userData.isPremium ? 'text-slate-300' : 'text-slate-500'}`}>
                                {userData.isPremium ? 'You have unlimited document uploads unlocked.' : 'You can upload up to 10 documents max.'}
                            </p>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${userData.isPremium ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-700'}`}>
                            Current
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Available Plans */}
            <div>
                <h2 className="text-xl font-bold text-slate-800 mb-6">Available Plans</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl gap-6">
                    {plans.map((plan, i) => (
                        <motion.div 
                            key={i}
                            whileHover={{ y: -6 }} 
                            className={`relative flex flex-col rounded-2xl border-2 p-6 ${plan.highlight ? 'border-slate-900 shadow-xl bg-slate-900 text-white' : 'border-slate-200 shadow-sm bg-white'}`}
                        >
                            {plan.badge && (
                                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                                    <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">{plan.badge}</span>
                                </div>
                            )}
                            {plan.isCurrent && (
                                <div className="absolute top-4 right-4">
                                    <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Active</span>
                                </div>
                            )}
                            <h3 className={`font-bold text-lg mb-1 ${plan.highlight ? 'text-white' : 'text-slate-800'}`}>{plan.name}</h3>
                            <div className="flex items-end gap-1 mb-6">
                                <span className={`text-4xl font-black ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>{plan.price}</span>
                                <span className={`text-sm mb-1.5 ${plan.highlight ? 'text-slate-300' : 'text-slate-500'}`}>{plan.cycle}</span>
                            </div>
                            <ul className="space-y-3 flex-1 mb-8">
                                {plan.features.map((f, idx) => (
                                    <li key={idx} className={`flex items-center gap-2 text-sm ${plan.highlight ? 'text-slate-200' : 'text-slate-600'}`}>
                                        <Check size={16} className={plan.highlight ? 'text-green-400' : 'text-green-600'} /> {f}
                                    </li>
                                ))}
                            </ul>
                            <button 
                                onClick={plan.action ? plan.action : undefined}
                                className={`w-full py-3 rounded-xl font-semibold text-sm transition 
                                    ${plan.highlight && plan.action ? 'bg-white text-slate-900 hover:bg-slate-100 cursor-pointer shadow-lg shadow-white/20' 
                                    : plan.highlight && !plan.action ? 'bg-white/20 text-white cursor-default' 
                                    : 'bg-slate-100 text-slate-500 cursor-default'}`}
                            >
                                {plan.cta}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Features included */}
            {userData.isPremium && (
                <Card>
                    <CardHeader title="Features Included in Your Plan" subtitle="Everything available in Premium" />
                    <CardContent className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                        {features.map((f, i) => (
                            <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-700 font-medium">
                                <Check size={16} className="text-green-500 shrink-0" /> {f}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

        </div>
    );
};

export default Subscription;
