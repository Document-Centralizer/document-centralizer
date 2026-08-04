import React from "react";
import StatCard from "./StatCard";
import { stats as initialStats } from "../../data/adminDashboardData";

export default function DashboardStats({ data, totalUsers }) {
    const updatedStats = [...initialStats];
    
    if (data) {
        updatedStats[0] = { ...updatedStats[0], value: totalUsers.toLocaleString() };
        updatedStats[1] = { ...updatedStats[1], value: (data.totalDocuments || 0).toLocaleString() };
        updatedStats[2] = { ...updatedStats[2], value: (data.verifiedDocuments || 0).toLocaleString() };
        updatedStats[3] = { ...updatedStats[3], value: (data.pendingAdminDocuments || 0).toLocaleString() };
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {updatedStats.map((stat, i) => (
                <StatCard key={i} stat={stat} />
            ))}
        </div>
    );
}
