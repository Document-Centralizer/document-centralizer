import React, { useState, useEffect } from "react";
import StatCard from "./StatCard";
import { stats as initialStats } from "../../data/adminDashboardData";
import api from "../../services/api";

export default function DashboardStats() {
    const [dashboardStats, setDashboardStats] = useState(initialStats);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get("/admin/dashboard");
                const data = response.data;
                
                const updatedStats = [...initialStats];
                updatedStats[0] = { ...updatedStats[0], value: data.totalUsers.toLocaleString() };
                updatedStats[1] = { ...updatedStats[1], value: data.totalDocuments.toLocaleString() };
                updatedStats[2] = { ...updatedStats[2], title: "Verified Documents", value: data.verifiedDocuments.toLocaleString() };
                updatedStats[3] = { ...updatedStats[3], title: "Pending Documents", value: data.pendingDocuments.toLocaleString() };
                
                setDashboardStats(updatedStats);
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardStats.map((stat, i) => (
                <StatCard key={i} stat={stat} />
            ))}
        </div>
    );
}
