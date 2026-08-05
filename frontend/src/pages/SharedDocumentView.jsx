import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, Download, Eye, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../services/api';

export default function SharedDocumentView() {
    const { shareSlug } = useParams();
    const [metadata, setMetadata] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                // Call the public metadata endpoint
                const res = await api.get(`/documents/share/metadata/${shareSlug}`);
                setMetadata(res.data);
            } catch (err) {
                setError('This document is not available, or the link is invalid.');
            } finally {
                setLoading(false);
            }
        };

        if (shareSlug) {
            fetchMetadata();
        }
    }, [shareSlug]);

    const handlePreview = async () => {
        if (previewUrl) return; // already loaded
        try {
            const fileRes = await api.get(`/documents/share/${shareSlug}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([fileRes.data], { type: fileRes.headers['content-type'] }));
            setPreviewUrl(url);
        } catch (err) {
            alert('Failed to load document preview.');
        }
    };

    const handleDownload = async () => {
        try {
            const response = await api.get(`/documents/share/${shareSlug}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', metadata?.originalFileName || 'document');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            alert('Failed to download document.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <p className="text-slate-500 font-medium">Loading Document...</p>
            </div>
        );
    }

    if (error || !metadata) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
                <AlertCircle size={48} className="text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Document Unavailable</h2>
                <p className="text-slate-500 mb-6">{error}</p>
                <Link to="/login" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                    Go to Login
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4">
            
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                
                {/* Header */}
                <div className="bg-slate-900 p-6 flex flex-col sm:flex-row items-center justify-between text-white">
                    <div className="flex items-center gap-3 mb-4 sm:mb-0">
                        <FileText size={32} className="text-blue-400" />
                        <div>
                            <h1 className="text-xl font-bold">{metadata.documentName || metadata.originalFileName}</h1>
                            <div className="text-sm text-slate-400 flex items-center flex-wrap gap-2 mt-1">
                                <span>{metadata.documentType} • Shared by {metadata.ownerName || 'User'}</span>
                                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-semibold rounded-md flex items-center gap-1">
                                    <CheckCircle size={12} /> Officially Verified
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handlePreview}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition"
                        >
                            <Eye size={16} /> Load Preview
                        </button>
                        <button 
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition shadow-lg shadow-blue-900/20"
                        >
                            <Download size={16} /> Download
                        </button>
                    </div>
                </div>

                {/* Preview Area */}
                <div className="h-[70vh] bg-slate-100 flex items-center justify-center relative p-4">
                    {previewUrl ? (
                        <iframe 
                            src={`${previewUrl}#toolbar=0`} 
                            className="w-full h-full border border-slate-300 rounded shadow-sm bg-white" 
                            title="Document Preview" 
                        />
                    ) : (
                        <div className="text-center">
                            <FileText size={48} className="text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500 font-medium">Click "Load Preview" to view this document securely.</p>
                        </div>
                    )}
                </div>

            </div>
            
            <div className="mt-8 text-center text-sm text-slate-400">
                Powered by Document Centralizer
            </div>
        </div>
    );
}
