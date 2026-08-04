import React, { useState, useEffect } from "react";
import DocumentsTable from "../../../components/admin/DocumentsTable";
import { FileText, Clock3, XCircle } from "lucide-react";
import api from "../../../services/api";

export default function DocumentsSection() {
    const [filter, setFilter] = useState("All");
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await api.get('/documents/');
            const mappedDocs = response.data.map(doc => {
                let uiState = doc.verificationStatus;
                if (uiState === 'VERIFIED') uiState = 'Approved';
                else if (uiState === 'PENDING_ADMIN') uiState = 'Pending';
                else if (uiState === 'REJECTED') uiState = 'Rejected';
                else if (uiState === 'FORWARDED_TO_SUPERADMIN') uiState = 'Forwarded';

                return {
                    id: doc.id,
                    name: doc.documentName,
                    category: doc.documentType,
                    owner: doc.ownerName || ("User " + doc.userId),
                    date: doc.uploadedAt ? doc.uploadedAt.split('T')[0] : 'N/A',
                    state: uiState,
                    ocrText: doc.ocrText,
                    ocrConfidenceScore: doc.ocrConfidenceScore,
                    rejectionReason: doc.rejectionReason
                };
            });
            setDocuments(mappedDocs);
        } catch (error) {
            console.error("Failed to fetch documents:", error);
        }
    };

    const handleReject = async (id, reason) => {
        try {
            await api.put(`/admin/documents/${id}/reject?reason=${encodeURIComponent(reason)}`);
            fetchDocuments();
        } catch (error) {
            console.error("Failed to reject document:", error);
        }
    };

    const handleForward = async (id, remarks) => {
        try {
            let url = `/admin/documents/${id}/forward`;
            if (remarks) {
                url += `?remarks=${encodeURIComponent(remarks)}`;
            }
            await api.put(url);
            fetchDocuments();
        } catch (error) {
            console.error("Failed to forward document:", error);
        }
    };

    const handleAuthBridgeVerify = async (id) => {
        try {
            await api.put(`/admin/documents/${id}/verify-authbridge`);
            fetchDocuments();
        } catch (error) {
            console.error("Failed to verify document via AuthBridge:", error);
        }
    };

    const approvedCount = documents.filter(d => d.state === 'Approved').length;
    const pendingCount = documents.filter(d => d.state === 'Pending').length;
    const rejectedCount = documents.filter(d => d.state === 'Rejected').length;

    const dynamicStats = [
        { title: "Approved Documents", value: approvedCount.toString(), icon: FileText, color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-100", filterKey: "Approved" },
        { title: "Pending Review", value: pendingCount.toString(), icon: Clock3, color: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-100", filterKey: "Pending" },
        { title: "Rejected Documents", value: rejectedCount.toString(), icon: XCircle, color: "text-red-700", bg: "bg-red-50", border: "border-red-100", filterKey: "Rejected" },
    ];

    return (
        <div className="animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Document Repository</h2>
                {filter !== "All" && (
                    <button onClick={() => setFilter("All")} className="text-sm font-bold text-blue-600 hover:text-blue-800 transition">
                        View All Documents
                    </button>
                )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {dynamicStats.map((stat, idx) => {
                    const isActive = filter === stat.filterKey;
                    return (
                        <div 
                            key={idx} 
                            onClick={() => setFilter(isActive ? "All" : stat.filterKey)}
                            className={`p-6 rounded-2xl border ${stat.border} ${stat.bg} ${stat.color} flex flex-col gap-2 cursor-pointer transition-all transform hover:scale-[1.02] ${isActive ? 'ring-2 ring-offset-2 ring-blue-400' : 'opacity-80 hover:opacity-100'}`}
                        >
                            <stat.icon size={24} />
                            <h3 className="font-bold text-xl">{stat.value}</h3>
                            <p className="text-sm font-medium">{stat.title}</p>
                        </div>
                    );
                })}
            </div>

            <DocumentsTable 
                filter={filter} 
                documents={documents}
                onReject={handleReject}
                onForward={handleForward}
                onAuthBridgeVerify={handleAuthBridgeVerify}
            />
        </div>
    );
}
