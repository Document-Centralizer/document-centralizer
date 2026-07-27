import React from "react";
import DashboardStats from "../../../components/admin/DashboardStats";
import RecentActivity from "../../../components/admin/RecentActivity";
import SystemStatus from "../../../components/admin/SystemStatus";

export default function DashboardOverview() {
    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            <DashboardStats />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentActivity />
                <SystemStatus />
            </div>
        </div>
    );
}
