import React from "react";
import Sidebar from "../../components/admin/Sidebar";
import DashboardOverview from "./dashboard/DashboardOverview";
import UsersSection from "./dashboard/UsersSection";
import DocumentsSection from "./dashboard/DocumentsSection";
import CategoriesSection from "./dashboard/CategoriesSection";
import SubscriptionsSection from "./dashboard/SubscriptionsSection";
import ReportsSection from "./dashboard/ReportsSection";
import ProfileSection from "./dashboard/ProfileSection";
import { useAdminDashboard } from "../../hooks/useAdminDashboard";

export default function AdminDashboard() {
    const { activeTab, setActiveTab } = useAdminDashboard();

    return (
        <div className="flex flex-col md:flex-row gap-6 w-full font-sans min-h-[calc(100vh-3rem)]">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="flex-1 bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8">
                {activeTab === "Dashboard" && <DashboardOverview />}
                {activeTab === "Users" && <UsersSection />}
                {activeTab === "Documents" && <DocumentsSection />}
                {activeTab === "Categories" && <CategoriesSection />}
                {activeTab === "Subscriptions" && <SubscriptionsSection />}
                {activeTab === "Reports" && <ReportsSection />}
                {activeTab === "Profile" && <ProfileSection />}
            </div>
        </div>
    );
}
