import React, { useState, useEffect } from "react";
import SubscriptionCard from "../../../components/admin/SubscriptionCard";
import api from "../../../services/api";

export default function SubscriptionsSection() {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [stats, setStats] = useState({ basic: 0, pro: 0 });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const response = await api.get('/admin/subscriptions');
                const data = response.data;
                setStats({
                    basic: data.basicCount,
                    premium: data.premiumCount
                });
                
                // Map API users to match expected format
                const mappedUsers = data.subscribedUsers.map(u => ({
                    id: u.id,
                    name: `${u.firstName} ${u.lastName}`,
                    email: u.email,
                    plan: u.subscriptionPlan || "Basic",
                    date: "Active" // Default to active since we don't have a subscribe date right now
                }));
                setUsers(mappedUsers);
            } catch (error) {
                console.error("Failed to fetch subscriptions:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSubscriptions();
    }, []);

    const handleManagePlan = (planName) => {
        setSelectedPlan(selectedPlan === planName ? null : planName);
    };

    const displayUsers = selectedPlan 
        ? users.filter(u => u.plan === selectedPlan)
        : users;

    const dynamicSubscriptionPlans = [
        { name: "Basic", price: "Free", users: stats.basic, features: ["Up to 10 Documents", "Standard Support", "Basic Analytics"] },
        { name: "Premium", price: "₹99/mo", users: stats.premium, features: ["Unlimited Documents", "Priority Support", "Advanced Analytics", "Custom Categories"], recommended: true }
    ];

    return (
        <div className="animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Subscription Plans</h2>
                {selectedPlan && (
                    <button 
                        onClick={() => setSelectedPlan(null)} 
                        className="text-sm font-bold text-blue-600 hover:text-blue-800 transition"
                    >
                        View Recent Subscriptions
                    </button>
                )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 max-w-4xl mx-auto">
                {dynamicSubscriptionPlans.map(plan => (
                    <SubscriptionCard 
                        key={plan.name} 
                        plan={plan} 
                        isSelected={selectedPlan === plan.name}
                        onManage={handleManagePlan}
                    />
                ))}
            </div>

            <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                    {selectedPlan ? `Users on ${selectedPlan} Plan` : "Recent Subscriptions"}
                </h3>
                <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 text-gray-600 font-semibold">
                            <tr>
                                <th className="px-6 py-4">User Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Plan</th>
                                <th className="px-6 py-4">Subscribed Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 bg-white">
                            {displayUsers.length > 0 ? displayUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 font-semibold text-gray-800">{user.name}</td>
                                    <td className="px-6 py-4 text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            user.plan === 'Premium' ? 'bg-blue-100 text-blue-700' :
                                            'bg-slate-100 text-slate-700'
                                        }`}>
                                            {user.plan}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{user.date}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                        No users found for this plan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
