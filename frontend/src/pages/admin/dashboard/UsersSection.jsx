import React, { useState, useEffect } from "react";
import UsersTable from "../../../components/admin/UsersTable";
import api from "../../../services/api";

export default function UsersSection() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get("/admin/users");
            const mappedUsers = response.data.map(u => ({
                id: u.id,
                name: `${u.firstName} ${u.lastName}`,
                email: u.email,
                role: u.role,
                status: u.enabled ? "Active" : "Disabled"
            }));
            setUsers(mappedUsers);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    };

    const handleRemoveUser = async (id) => {
        try {
            await api.delete(`/admin/users/${id}`);
            fetchUsers();
        } catch (error) {
            console.error("Failed to delete user:", error);
        }
    };

    return (
        <div className="animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">User Management</h2>
                    <p className="text-sm text-gray-500">View and manage all registered users.</p>
                </div>
            </div>
            <UsersTable users={users} onRemove={handleRemoveUser} />
        </div>
    );
}
