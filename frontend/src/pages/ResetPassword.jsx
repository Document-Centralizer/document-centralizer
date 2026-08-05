import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { resetPassword } from "../services/authService";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);
        try {
            const res = await resetPassword({ token, newPassword });
            setMessage(res.message || "Password reset successfully. You can now login.");
        } catch (err) {
            setError(err.response?.data?.message || "Invalid or expired token. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Invalid Request</h2>
                    <p className="text-gray-500 mb-4">No password reset token provided.</p>
                    <Link to="/login" className="text-blue-600 hover:underline">Go to Login</Link>
                </div>
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Reset Password</h1>
                    <p className="text-gray-500 mt-2 text-sm">Enter your new password below.</p>
                </div>

                {message && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm text-center">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
                        {error}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 transition duration-300 text-white font-semibold py-3 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <Link to="/login" className="text-blue-600 font-semibold hover:underline text-sm">
                        Back to Login
                    </Link>
                </div>
            </div>
        </section>
    );
}
