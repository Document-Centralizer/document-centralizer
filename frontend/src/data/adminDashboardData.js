import { Users, FileText, CheckCircle, Clock3, ShieldCheck, Database, CreditCard, BarChart, FileSearch, XCircle, LayoutDashboard, UserCircle } from "lucide-react";

export const tabs = [
    "Dashboard", "Users", "Documents", "Subscriptions", "Reports", "Profile"
];

export const stats = [
    { title: "Total Users", value: "0", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Documents Stored", value: "0", icon: Database, color: "text-slate-600", bg: "bg-slate-200" },
    { title: "Verified Documents", value: "0", icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
    { title: "Pending Documents", value: "0", icon: Clock3, color: "text-yellow-600", bg: "bg-yellow-100" },
];

export const recentActivities = [
    { action: "New Document Upload", desc: "Q3_Financial_Report.pdf by Alice Smith", time: "10 mins ago", icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
    { action: "Category Added", desc: "Marketing team added 'Q3 Campaigns'", time: "1 hour ago", icon: FileSearch, color: "text-purple-500", bg: "bg-purple-50" },
    { action: "Document Deleted", desc: "Old_Handbook.docx was removed", time: "3 hours ago", icon: XCircle, color: "text-red-500", bg: "bg-red-50" },
    { action: "Storage Alert", desc: "Storage reached 40% capacity", time: "5 hours ago", icon: Database, color: "text-yellow-500", bg: "bg-yellow-50" }
];

export const systemStatus = [
    { label: "PDF Documents", value: "240 GB", percentage: "56%", color: "bg-red-500" },
    { label: "Word Documents", value: "110 GB", percentage: "25%", color: "bg-blue-500" },
    { label: "Excel Spreadsheets", value: "50 GB", percentage: "12%", color: "bg-green-500" },
    { label: "Other Formats", value: "28 GB", percentage: "7%", color: "bg-slate-500" },
];

export const usersData = [
    { name: "Alice Smith", email: "alice@example.com", role: "USER", status: "Active" },
    { name: "Bob Johnson", email: "bob@example.com", role: "ADMIN", status: "Active" },
    { name: "Charlie Brown", email: "charlie@example.com", role: "USER", status: "Inactive" },
];

export const documentsStats = [
    { title: "Approved Documents", value: "5,432", icon: FileText, color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-100", filterKey: "Approved" },
    { title: "Pending Review", value: "156", icon: Clock3, color: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-100", filterKey: "Pending" },
    { title: "Rejected Documents", value: "89", icon: XCircle, color: "text-red-700", bg: "bg-red-50", border: "border-red-100", filterKey: "Rejected" },
];

export const allDocumentsData = [
    { id: 1, name: "Financial_Report_Q1.pdf", category: "Finance", owner: "Alice Smith", state: "Approved", date: "2026-01-15" },
    { id: 2, name: "Employee_Handbook_2026.docx", category: "Human Resources", owner: "Bob Johnson", state: "Approved", date: "2026-02-10" },
    { id: 3, name: "Marketing_Campaign_v2.pptx", category: "Marketing", owner: "Charlie Brown", state: "Pending", date: "2026-07-25" },
    { id: 4, name: "Q3_Budget_Draft.xlsx", category: "Finance", owner: "Alice Smith", state: "Pending", date: "2026-07-26" },
    { id: 5, name: "Legal_Contract_Draft.pdf", category: "Legal", owner: "David Lee", state: "Rejected", date: "2026-07-20" },
    { id: 6, name: "Project_Proposal.pdf", category: "Engineering", owner: "Eve Adams", state: "Approved", date: "2026-05-05" },
];



export const categoriesData = [
    "Finance", "Legal", "Human Resources", "Engineering", "Marketing", "Personal", "Medical"
];

// Removed subscriptionPlans and subscribedUsersData since they are now fetched from the backend API

export const reportsData = [
    { id: "users", title: "User Growth Report", desc: "View monthly user acquisition metrics", icon: BarChart, color: "text-blue-500", bg: "bg-blue-50", textBtn: "text-blue-700", hoverBtn: "hover:bg-blue-100" },
    { id: "subscriptions", title: "Subscription Trends", desc: "Analyze subscription plan upgrades", icon: FileSearch, color: "text-purple-500", bg: "bg-purple-50", textBtn: "text-purple-700", hoverBtn: "hover:bg-purple-100" }
];

export const tabIcons = {
    "Dashboard": LayoutDashboard,
    "Users": Users,
    "Documents": Database,
    "Categories": FileSearch,
    "Subscriptions": CreditCard,
    "Reports": BarChart,
    "Profile": UserCircle
};
