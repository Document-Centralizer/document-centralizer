import { Users, FileText, CheckCircle, Clock3, ShieldCheck, Database, CreditCard, BarChart, FileSearch, XCircle, LayoutDashboard, UserCircle } from "lucide-react";

export const tabs = [
    "Dashboard", "Users", "Documents", "Categories", "Subscriptions", "Reports", "Profile"
];

export const stats = [
    { title: "Total Users", value: "1,248", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Documents Stored", value: "8,432", icon: Database, color: "text-slate-600", bg: "bg-slate-200" },
    { title: "Total Categories", value: "7", icon: FileSearch, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "Storage Used", value: "428 GB", icon: ShieldCheck, color: "text-green-600", bg: "bg-green-100" },
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

export const subscriptionPlans = [
    {name: "Basic", price: "Free", users: "1,024 Active", color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200"},
    {name: "Pro", price: "$9.99/mo", users: "432 Active", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200"},
    {name: "Enterprise", price: "$49.99/mo", users: "89 Active", color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200"}
];

export const subscribedUsersData = [
    { id: 1, name: "Alice Smith", email: "alice@example.com", plan: "Basic", date: "2026-07-26" },
    { id: 2, name: "Bob Johnson", email: "bob@example.com", plan: "Pro", date: "2026-07-25" },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com", plan: "Enterprise", date: "2026-07-20" },
    { id: 4, name: "David Lee", email: "david@example.com", plan: "Basic", date: "2026-07-27" },
    { id: 5, name: "Eve Adams", email: "eve@example.com", plan: "Pro", date: "2026-07-15" },
];

export const reportsData = [
    { id: "users", title: "User Growth Report", desc: "View monthly user acquisition metrics", icon: BarChart, color: "text-blue-500", bg: "bg-blue-50", textBtn: "text-blue-700", hoverBtn: "hover:bg-blue-100" },
    { id: "subscriptions", title: "Subscriptions Growth Report", desc: "View subscription tier upgrades and growth", icon: CreditCard, color: "text-purple-500", bg: "bg-purple-50", textBtn: "text-purple-700", hoverBtn: "hover:bg-purple-100" }
];

export const userGrowthData = [
    { month: "Jan", users: 120 },
    { month: "Feb", users: 150 },
    { month: "Mar", users: 200 },
    { month: "Apr", users: 280 },
    { month: "May", users: 400 },
    { month: "Jun", users: 650 },
    { month: "Jul", users: 850 },
];

export const subscriptionsGrowthData = [
    { month: "Jan", basic: 100, pro: 20, enterprise: 0 },
    { month: "Feb", basic: 120, pro: 30, enterprise: 0 },
    { month: "Mar", basic: 150, pro: 50, enterprise: 0 },
    { month: "Apr", basic: 200, pro: 80, enterprise: 0 },
    { month: "May", basic: 300, pro: 100, enterprise: 5 },
    { month: "Jun", basic: 450, pro: 200, enterprise: 10 },
    { month: "Jul", basic: 500, pro: 350, enterprise: 25 },
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
