import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import { FileText, Clock3, CheckCircle, XCircle, Upload, File } from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import { Link } from "react-router-dom";
import api from '../../services/api';

const UserDashboard = () => {
    const [documents, setDocuments] = useState([]);
    const [dashboardStats, setDashboardStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const docsResponse = await api.get('/documents/my');
                setDocuments(docsResponse.data || []);
                const statsResponse = await api.get('/users/dashboard');
                setDashboardStats(statsResponse.data);
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const stats = [
        { title: "Total Documents", value: dashboardStats ? dashboardStats.totalDocuments.toString() : "0", icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
        { title: "Pending", value: dashboardStats ? dashboardStats.pendingDocuments.toString() : "0", icon: Clock3, color: "text-yellow-500", bg: "bg-yellow-50" },
        { title: "Approved", value: dashboardStats ? dashboardStats.approvedDocuments.toString() : "0", icon: CheckCircle, color: "text-green-500", bg: "bg-green-50" },
        { title: "Rejected", value: dashboardStats ? dashboardStats.rejectedDocuments.toString() : "0", icon: XCircle, color: "text-red-500", bg: "bg-red-50" },
    ];

    const recentDocs = [...documents].reverse().slice(0, 5);

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Welcome to Document Centralizer</h1>
                    <p className="text-slate-300 max-w-lg">Manage, verify, and store all your crucial documents in one highly secure platform.</p>
                </div>
                <Link to="/user/upload" className="relative z-10 bg-white text-slate-900 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-slate-100 transition shadow-lg">
                    <Upload size={18} /> Upload Document
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i}>
                        <CardContent className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                <stat.icon size={28} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">{stat.title}</p>
                                <h3 className="text-2xl font-bold text-slate-800">
                                    {isLoading ? "..." : stat.value}
                                </h3>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader title="Recent Documents" subtitle="Your recently uploaded files" />
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="p-8 text-center text-slate-500">Loading documents...</div>
                        ) : recentDocs.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">No documents found. Upload a document to get started.</div>
                        ) : (
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Document Name</th>
                                        <th className="px-6 py-4 font-medium">Category</th>
                                        <th className="px-6 py-4 font-medium">Date</th>
                                        <th className="px-6 py-4 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {recentDocs.map(doc => (
                                        <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 flex items-center gap-3">
                                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><File size={16}/></div>
                                                <span className="font-medium text-slate-700">{doc.documentName || doc.name}</span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">{doc.documentType || doc.category}</td>
                                            <td className="px-6 py-4 text-slate-500">
                                                {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : doc.date}
                                            </td>
                                            <td className="px-6 py-4"><Badge status={doc.status}/></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader title="Quick Actions" />
                    <CardContent className="flex flex-col gap-3">
                        <Link to="/user/upload" className="w-full flex items-center gap-3 p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition font-medium text-slate-700"><Upload size={20} className="text-slate-400"/> Upload New Document</Link>
                        <Link to="/user/my-documents" className="w-full flex items-center gap-3 p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition font-medium text-slate-700"><FileText size={20} className="text-slate-400"/> View All Documents</Link>
                        <Link to="/user/my-documents" className="w-full flex items-center gap-3 p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition font-medium text-slate-700"><Clock3 size={20} className="text-slate-400"/> Check Pending Status</Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
export default UserDashboard;
