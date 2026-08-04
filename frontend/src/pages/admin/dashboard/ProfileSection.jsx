import React, { useState, useContext, useEffect } from "react";
import { UserCircle, Mail, Shield, Calendar, Edit2, Key, Save, X } from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";

export default function ProfileSection() {
    const { user, updateUser } = useContext(AuthContext);

    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editName, setEditName] = useState("");
    const [editEmail, setEditEmail] = useState("");

    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        if (user) {
            setEditName(user.name || "");
            setEditEmail(user.email || "");
        }
    }, [user]);

    const handleSaveProfile = async () => {
        try {
            const nameParts = editName.split(" ");
            const firstName = nameParts[0];
            const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
            
            const { default: api } = await import('../../../services/api');
            const response = await api.put('/users/profile', {
                firstName,
                lastName,
                email: editEmail
            });
            
            updateUser({ 
                name: `${response.data.firstName} ${response.data.lastName}`, 
                email: response.data.email 
            });
            
            setIsEditingProfile(false);
            setMessage({ type: "success", text: "Profile updated successfully!" });
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        } catch (error) {
            setMessage({ type: "error", text: "Failed to update profile. Please try again." });
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage({ type: "error", text: "New passwords do not match." });
            return;
        }
        try {
            const { default: api } = await import('../../../services/api');
            await api.put('/users/password', {
                currentPassword,
                newPassword
            });
            setIsUpdatingPassword(false);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setMessage({ type: "success", text: "Password updated successfully!" });
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        } catch (error) {
            const errMsg = error.response?.data?.error || "Failed to update password. Please check your current password.";
            setMessage({ type: "error", text: errMsg });
        }
    };

    if (!user) {
        return <div className="p-8 text-center text-gray-500 font-semibold">Loading profile...</div>;
    }

    return (
        <div className="animate-in fade-in duration-300">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Admin Profile</h2>
            
            {message.text && (
                <div className={`mb-4 p-4 rounded-xl text-sm font-bold ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    {message.text}
                </div>
            )}

            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-8 items-start md:items-center mb-8">
                <div className="w-32 h-32 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0 relative overflow-hidden group">
                    <UserCircle size={64} />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-semibold text-xs text-center px-2">
                        Change Photo
                    </div>
                </div>
                
                <div className="flex-1 w-full">
                    {isEditingProfile ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                                <input 
                                    type="text" 
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                                <input 
                                    type="email" 
                                    value={editEmail}
                                    onChange={(e) => setEditEmail(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button onClick={handleSaveProfile} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition">
                                    <Save size={16} /> Save Changes
                                </button>
                                <button onClick={() => {
                                    setIsEditingProfile(false);
                                    setEditName(user.name || "");
                                    setEditEmail(user.email || "");
                                }} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold transition">
                                    <X size={16} /> Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-extrabold text-gray-800">{user.name}</h3>
                                    <p className="text-blue-600 font-semibold text-sm capitalize">{user.role}</p>
                                </div>
                                <button onClick={() => setIsEditingProfile(true)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 font-bold transition">
                                    <Edit2 size={16} /> Edit Profile
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Mail size={18} className="text-gray-400" />
                                    <span>{user.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Shield size={18} className="text-gray-400" />
                                    <span className="capitalize">{user.role} Access</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Calendar size={18} className="text-gray-400" />
                                    <span>Joined: Jan 2026</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Security Settings</h3>
                        <p className="text-sm text-gray-500">Update your password to keep your account secure.</p>
                    </div>
                    {!isUpdatingPassword && (
                        <button onClick={() => setIsUpdatingPassword(true)} className="flex items-center gap-2 bg-slate-50 text-slate-700 hover:bg-slate-100 px-4 py-2 rounded-xl text-sm font-bold transition">
                            <Key size={16} /> Update Password
                        </button>
                    )}
                </div>

                {isUpdatingPassword && (
                    <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md border-t border-gray-100 pt-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Current Password</label>
                            <input 
                                type="password" 
                                required
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
                            <input 
                                type="password" 
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm New Password</label>
                            <input 
                                type="password" 
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex gap-2 pt-2">
                            <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition">
                                <Save size={16} /> Save Password
                            </button>
                            <button type="button" onClick={() => {
                                setIsUpdatingPassword(false);
                                setCurrentPassword("");
                                setNewPassword("");
                                setConfirmPassword("");
                            }} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold transition">
                                <X size={16} /> Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
