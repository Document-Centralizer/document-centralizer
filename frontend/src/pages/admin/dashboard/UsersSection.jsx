import React from "react";
import UsersTable from "../../../components/admin/UsersTable";

export default function UsersSection() {
    return (
        <div className="animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">User Management</h2>
                    <p className="text-sm text-gray-500">View and manage all registered users.</p>
                </div>
            </div>
            <UsersTable />
        </div>
    );
}
