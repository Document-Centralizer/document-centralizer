import React, { useState, useEffect } from "react";
import { Eye, X, Send } from "lucide-react";
import api from "../../services/api";

const DocumentViewer = ({ docId }) => {
    const [docUrl, setDocUrl] = useState(null);

    useEffect(() => {
        if (docId) {
            api.get(`/documents/${docId}/download`, { responseType: 'blob' })
                .then(res => {
                    const url = URL.createObjectURL(res.data);
                    setDocUrl(url);
                })
                .catch(console.error);
        }
        return () => {
            if (docUrl) URL.revokeObjectURL(docUrl);
        };
    }, [docId]);

    if (!docUrl) return <span className="text-gray-400">Loading document...</span>;
    return <iframe src={docUrl} className="w-full h-full border-0" title="Document Viewer" />;
};

export default function DocumentsTable({ filter, documents, onReject, onForward, onAuthBridgeVerify }) {
    const [viewDoc, setViewDoc] = useState(null);
    const [rejectDoc, setRejectDoc] = useState(null);
    const [rejectReason, setRejectReason] = useState("");
    const [forwardDoc, setForwardDoc] = useState(null);
    const [forwardRemark, setForwardRemark] = useState("");

    const filteredDocs = filter === "All" 
        ? documents 
        : documents.filter(doc => doc.state === filter);

    return (
        <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-gray-600 font-semibold">
                    <tr>
                        <th className="px-6 py-4">Document Name</th>
                        <th className="px-6 py-4">Owner</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">State</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 bg-white">
                    {filteredDocs.length > 0 ? filteredDocs.map((doc) => (
                        <tr key={doc.id} className="hover:bg-slate-50 transition">
                            <td className="px-6 py-4 font-semibold text-gray-800">{doc.name}</td>
                            <td className="px-6 py-4 text-gray-500">{doc.owner}</td>
                            <td className="px-6 py-4 text-gray-500">{doc.date}</td>
                            <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    doc.state === 'Approved' ? 'bg-green-100 text-green-700' : 
                                    doc.state === 'Rejected' ? 'bg-red-100 text-red-700' :
                                    doc.state === 'Forwarded' ? 'bg-purple-100 text-purple-700' :
                                    'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {doc.state}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                <button 
                                    onClick={() => setViewDoc(doc)} 
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" 
                                    title="View"
                                >
                                    <Eye size={18} />
                                </button>
                                {doc.state === 'Pending' && (
                                    <>
                                        {['AADHAR', 'PAN'].includes(doc.category?.toUpperCase()) && (
                                            <button 
                                                onClick={() => onAuthBridgeVerify(doc.id)} 
                                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition" 
                                                title="Verify with AuthBridge"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => setRejectDoc(doc)} 
                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition" 
                                            title="Reject"
                                        >
                                            <X size={18} />
                                        </button>
                                        <button 
                                            onClick={() => setForwardDoc(doc)} 
                                            className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition" 
                                            title="Forward to Super Admin"
                                        >
                                            <Send size={18} />
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                No {filter !== "All" ? filter.toLowerCase() : ""} documents found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* View Modal */}
            {viewDoc && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-xl">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800">Document Details</h3>
                            <button onClick={() => setViewDoc(null)} className="text-gray-500 hover:text-gray-800">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="space-y-2 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl">
                                    <p><strong className="text-gray-800">Name:</strong> {viewDoc.name}</p>
                                    <p><strong className="text-gray-800">Owner:</strong> {viewDoc.owner}</p>
                                    <p><strong className="text-gray-800">Date:</strong> {viewDoc.date}</p>
                                    <p><strong className="text-gray-800">State:</strong> {viewDoc.state}</p>
                                    {viewDoc.rejectionReason && (
                                        <p><strong className="text-red-600">Rejection Reason:</strong> {viewDoc.rejectionReason}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-semibold text-gray-800">OCR Extracted Text</h4>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${viewDoc.ocrConfidenceScore != null ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                                            OCR Score: {viewDoc.ocrConfidenceScore != null ? viewDoc.ocrConfidenceScore.toFixed(2) : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-sm text-gray-700 h-48 overflow-y-auto whitespace-pre-wrap">
                                        {viewDoc.ocrText ? viewDoc.ocrText : <span className="text-gray-400 italic">No OCR text extracted yet.</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="h-[400px] md:h-auto border border-gray-200 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                                <DocumentViewer docId={viewDoc.id} />
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-100 flex justify-end">
                            <button 
                                onClick={() => setViewDoc(null)} 
                                className="px-6 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {rejectDoc && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
                        <h3 className="text-xl font-bold text-red-600 mb-2">Reject Document</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Please provide a reason for rejecting <strong>{rejectDoc.name}</strong>.
                        </p>
                        <textarea
                            className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
                            rows="4"
                            placeholder="Reason for rejection based on quality..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        ></textarea>
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => { setRejectDoc(null); setRejectReason(""); }} 
                                className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => {
                                    if(rejectReason.trim()) {
                                        onReject(rejectDoc.id, rejectReason);
                                        setRejectDoc(null);
                                        setRejectReason("");
                                    }
                                }} 
                                disabled={!rejectReason.trim()}
                                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition disabled:opacity-50"
                            >
                                Submit Rejection
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Forward Modal */}
            {forwardDoc && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
                        <h3 className="text-xl font-bold text-purple-600 mb-2">Forward to Super Admin</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Please provide a remark for Super Admin regarding <strong>{forwardDoc.name}</strong>.
                        </p>
                        <textarea
                            className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
                            rows="4"
                            placeholder="Add your remarks here..."
                            value={forwardRemark}
                            onChange={(e) => setForwardRemark(e.target.value)}
                        ></textarea>
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => { setForwardDoc(null); setForwardRemark(""); }} 
                                className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => {
                                    onForward(forwardDoc.id, forwardRemark);
                                    setForwardDoc(null);
                                    setForwardRemark("");
                                }} 
                                className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition"
                            >
                                Forward
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
