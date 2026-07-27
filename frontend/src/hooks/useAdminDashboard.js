import { useState } from "react";

export function useAdminDashboard(initialTab = "Dashboard") {
    const [activeTab, setActiveTab] = useState(initialTab);

    return {
        activeTab,
        setActiveTab,
    };
}
