import React from "react";
import StatCard from "./StatCard";
import { stats } from "../../data/adminDashboardData";

export default function DashboardStats() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
                <StatCard key={i} stat={stat} />
            ))}
        </div>
    );
}
