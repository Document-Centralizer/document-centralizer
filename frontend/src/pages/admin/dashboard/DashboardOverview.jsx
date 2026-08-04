import React, { useState, useEffect } from "react";
import DashboardStats from "../../../components/admin/DashboardStats";
import RecentActivity from "../../../components/admin/RecentActivity";
import SystemStatus from "../../../components/admin/SystemStatus";
import api from "../../../services/api";

export default function DashboardOverview() {
    const [dashboardData, setDashboardData] = useState(null);
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get("/admin/dashboard");
                setDashboardData(response.data);
                
                const usersResponse = await api.get("/admin/users");
                setTotalUsers(usersResponse.data ? usersResponse.data.length : 0);
            } catch (error) {
                console.error("Failed to fetch dashboard overview data:", error);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            <DashboardStats data={dashboardData} totalUsers={totalUsers} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentActivity activities={dashboardData?.recentActivities || []} />
                <SystemStatus storageData={dashboardData?.storageBreakdown || []} />
            </div>
        </div>
    );
}
