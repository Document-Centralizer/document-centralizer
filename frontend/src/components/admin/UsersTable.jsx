import React from "react";

export default function UsersTable({ users = [], onRemove }) {
    return (
        <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-gray-600 font-semibold">
                    <tr>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 bg-white">
                    {users.map((user, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition">
                            <td className="px-6 py-4 font-semibold text-gray-800">{user.name}</td>
                            <td className="px-6 py-4 text-gray-500">{user.email}</td>
                            <td className="px-6 py-4 text-gray-500 text-xs font-bold">{user.role}</td>
                            <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {user.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <button 
                                    onClick={() => onRemove(user.id)} 
                                    className="text-red-600 hover:text-red-800 font-semibold transition"
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
