import React, { useState, useEffect } from "react";
import DocumentsTable from "../../../components/admin/DocumentsTable";
import { documentsStats } from "../../../data/adminDashboardData";
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
            const mappedDocs = response.data.map(doc => ({
                id: doc.id,
                name: doc.documentName,
                category: doc.documentType,
                owner: "User " + doc.userId, // We don't have the username in DTO
                date: doc.uploadedAt ? doc.uploadedAt.split('T')[0] : 'N/A',
                state: doc.verificationStatus,
                ocrText: doc.ocrText,
                rejectionReason: doc.rejectionReason
            }));
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
                {documentsStats.map((stat, idx) => {
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
            />
        </div>
    );
}
