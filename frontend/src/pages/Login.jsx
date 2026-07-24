import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loginUser } from "../services/authService";

export default function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const user = await loginUser({ email, password });
            login(user);
            if (user.role === "admin") navigate("/admin");
            else if (user.role === "superadmin") navigate("/superadmin");
            else navigate("/user");
        } catch (err) {
            setError("Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">

                {/* Logo & Title */}
                <div className="text-center mb-2">
                    <div className="text-5xl mb-3">📄</div>

                    <h1 className="text-3xl font-bold text-blue-700">
                        Document Centralizer
                    </h1>
                </div>

                {/* Heading */}
                <div className="mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 text-center">
                        Welcome Back
                    </h2>

                    <p className="text-center text-gray-500 mt-2">
                        Sign in to continue
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form className="space-y-4" onSubmit={handleSubmit}>

                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                            Email Address
                        </label>

                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                            Password
                        </label>

                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 transition duration-300 text-white font-semibold py-3 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>

                </form>

                {/* Footer */}
                <div className="text-center mt-6">

                    <p className="text-gray-600">
                        New to Document Centralizer?
                    </p>

                    <Link
                        to="/register"
                        className="text-blue-600 font-semibold hover:underline"
                    >
                        Create an Account
                    </Link>

                </div>

            </div>
        </section>
    );
}