
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FileText, Clock3, CheckCircle, XCircle, Search, Filter, Plus, 
    Download, Trash2, Edit, Share2, Eye, MoreVertical, LayoutGrid, List, RefreshCw, Upload
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import api from '../../services/api';

// --- SUBCOMPONENTS ---

const StatsCard = ({ title, count, icon: Icon, color, bg }) => (
    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
        <Card className="h-full overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardContent className="p-6 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-slate-800">{count}</h3>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg} ${color}`}>
                    <Icon size={24} />
                </div>
            </CardContent>
        </Card>
    </motion.div>
);

const ActionMenu = ({ doc, onPreview, onDownload }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
            >
                <MoreVertical size={18} />
            </button>
            
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50"
                    >
                        <button onClick={() => onPreview(doc)} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                            <Eye size={16} className="text-slate-400"/> Preview
                        </button>
                        <button onClick={() => onDownload(doc.id, doc.fileName || doc.documentName)} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                            <Download size={16} className="text-slate-400"/> Download
                        </button>
                        
                        {doc.status === 'Approved' && (
                            <>
                                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                    <Share2 size={16} className="text-slate-400"/> Share Link
                                </button>
                                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                    <CheckCircle size={16} className="text-slate-400"/> Verification Details
                                </button>
                            </>
                        )}
                        
                        {doc.status === 'Rejected' && (
                            <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                <RefreshCw size={16} className="text-slate-400"/> Re-upload
                            </button>
                        )}
                        
                        {(doc.status === 'Pending' || doc.status === 'Rejected') && (
                            <>
                                <div className="h-px bg-slate-100 my-1"></div>
                                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                    <Trash2 size={16} className="text-red-400"/> Delete
                                </button>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const PreviewModal = ({ doc, onClose, onDownload }) => {
    if (!doc) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
            >
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">{doc.name}</h2>
                        <p className="text-sm text-slate-500">{doc.category} • {doc.size}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                        <XCircle size={24} />
                    </button>
                </div>
                
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                    <div className="flex-1 bg-slate-100 p-4 flex items-center justify-center overflow-auto">
                        {/* Placeholder for actual PDF/Image viewer */}
                        <img src={doc.previewUrl} alt={doc.name} className="max-w-full max-h-full object-contain rounded shadow-sm border border-slate-200" />
                    </div>
                    
                    <div className="w-full md:w-80 bg-white border-l border-slate-100 p-6 overflow-y-auto">
                        <h3 className="font-semibold text-slate-800 mb-4">Document Details</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Status</p>
                                <Badge status={doc.status} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Upload Date</p>
                                <p className="text-sm font-medium text-slate-700">{doc.uploadDate}</p>
                            </div>
                            {doc.status !== 'Pending' && (
                                <>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Verified By</p>
                                        <p className="text-sm font-medium text-slate-700">{doc.verifiedBy}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Verification Date</p>
                                        <p className="text-sm font-medium text-slate-700">{doc.verificationDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Remarks</p>
                                        <p className="text-sm text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">{doc.remarks || "No remarks provided."}</p>
                                    </div>
                                </>
                            )}
                        </div>
                        
                        <div className="mt-8 flex gap-3">
                            <button onClick={() => onDownload(doc.id, doc.fileName || doc.documentName)} className="flex-1 bg-slate-900 text-white py-2 rounded-xl text-sm font-medium hover:bg-slate-800 transition">Download</button>
                            {doc.status === 'Approved' && (
                                <button className="flex-1 border border-slate-200 text-slate-700 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 transition">Share</button>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// --- MAIN PAGE ---

const MyDocuments = () => {
    const [viewMode, setViewMode] = useState('table'); // table or grid
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [previewDoc, setPreviewDoc] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [documents, setDocuments] = useState([]);
    const [activity, setActivity] = useState([]);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await api.get('/documents/my');
                setDocuments(response.data);
            } catch (error) {
                console.error("Error fetching documents", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDocuments();
    }, []);

    const handleDownload = async (docId, fileName) => {
        try {
            const response = await api.get(`/documents/${docId}/download`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName || 'document');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading file", error);
            alert("Failed to download document");
        }
    };

    // Derived stats
    const totalCount = documents.length;
    const pendingCount = documents.filter(d => d.status === 'PENDING').length;
    const approvedCount = documents.filter(d => d.status === 'VERIFIED').length;
    const rejectedCount = documents.filter(d => d.status === 'REJECTED').length;

    // Filter logic
    const filteredDocs = documents.filter(doc => {
        const docName = doc.documentName || doc.name || '';
        const docType = doc.documentType || doc.category || '';
        const matchesSearch = docName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || 
                              (statusFilter === 'Pending' && doc.status === 'PENDING') || 
                              (statusFilter === 'Approved' && doc.status === 'VERIFIED') || 
                              (statusFilter === 'Rejected' && doc.status === 'REJECTED');
        const matchesCategory = categoryFilter === 'All' || docType === categoryFilter;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-12">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Documents</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage, search and track all your uploaded documents.</p>
                </div>
                <Link to="/user/upload" className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-slate-800 transition shadow-sm">
                    <Plus size={18} /> Upload Document
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title="Total Documents" count={totalCount} icon={FileText} color="text-slate-700" bg="bg-slate-100" />
                <StatsCard title="Pending Documents" count={pendingCount} icon={Clock3} color="text-yellow-600" bg="bg-yellow-100" />
                <StatsCard title="Approved Documents" count={approvedCount} icon={CheckCircle} color="text-green-600" bg="bg-green-100" />
                <StatsCard title="Rejected Documents" count={rejectedCount} icon={XCircle} color="text-red-600" bg="bg-red-100" />
            </div>

            {/* Main Content Layout */}
            <div className="flex flex-col xl:flex-row gap-6">
                
                {/* Left Area (Table/Grid) */}
                <div className="flex-1 space-y-4">
                    
                    {/* Toolbar */}
                    <Card>
                        <CardContent className="p-4 flex flex-col lg:flex-row gap-4 justify-between items-center bg-white">
                            <div className="flex flex-1 w-full gap-4">
                                <div className="relative flex-1 max-w-md">
                                    <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Search documents..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 text-sm transition"
                                    />
                                </div>
                                <select 
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 text-sm bg-white cursor-pointer"
                                >
                                    <option value="All">All Categories</option>
                                    <option value="Aadhaar">Aadhaar</option>
                                    <option value="PAN">PAN</option>
                                    <option value="Passport">Passport</option>
                                    <option value="Driving License">Driving License</option>
                                    <option value="10th Marksheet">10th Marksheet</option>
                                    <option value="Degree Certificate">Degree Certificate</option>
                                </select>
                                <select 
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 text-sm bg-white cursor-pointer hidden md:block"
                                >
                                    <option value="All">All Statuses</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <div className="flex bg-slate-100 p-1 rounded-xl">
                                    <button 
                                        onClick={() => setViewMode('table')}
                                        className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        <List size={18} />
                                    </button>
                                    <button 
                                        onClick={() => setViewMode('grid')}
                                        className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        <LayoutGrid size={18} />
                                    </button>
                                </div>
                                <button className="hidden sm:flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
                                    <Download size={16} /> Export
                                </button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Content Area */}
                    {isLoading ? (
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="h-16 bg-slate-100 animate-pulse rounded-xl"></div>
                                ))}
                            </CardContent>
                        </Card>
                    ) : filteredDocs.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                    <FileText size={40} className="text-slate-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-800 mb-1">No Documents Found</h3>
                                <p className="text-slate-500 max-w-sm mb-6">You haven't uploaded any documents that match your filters.</p>
                                <Link to="/user/upload" className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-slate-800 transition">
                                    Upload First Document
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            {viewMode === 'table' ? (
                                <Card className="overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm whitespace-nowrap">
                                            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                                                <tr>
                                                    <th className="px-6 py-4 font-medium">Document Name</th>
                                                    <th className="px-6 py-4 font-medium hidden md:table-cell">Category</th>
                                                    <th className="px-6 py-4 font-medium hidden lg:table-cell">File Size</th>
                                                    <th className="px-6 py-4 font-medium">Upload Date</th>
                                                    <th className="px-6 py-4 font-medium">Status</th>
                                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {filteredDocs.map(doc => (
                                                    <motion.tr 
                                                        key={doc.id}
                                                        whileHover={{ backgroundColor: "rgba(248, 250, 252, 1)" }}
                                                        className="transition-colors group"
                                                    >
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors cursor-pointer" onClick={() => setPreviewDoc(doc)}>
                                                                    <Eye size={18} />
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-slate-800 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => setPreviewDoc(doc)}>{doc.documentName || doc.name}</p>
                                                                    <p className="text-xs text-slate-500 md:hidden">{doc.documentType || doc.category}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-slate-500 hidden md:table-cell">{doc.documentType || doc.category}</td>
                                                        <td className="px-6 py-4 text-slate-500 hidden lg:table-cell">{doc.size || 'N/A'}</td>
                                                        <td className="px-6 py-4 text-slate-500">{new Date(doc.uploadedAt || doc.uploadDate).toLocaleDateString()}</td>
                                                        <td className="px-6 py-4"><Badge status={doc.status} /></td>
                                                        <td className="px-6 py-4 text-right flex justify-end items-center gap-2">
                                                            <button 
                                                                onClick={() => handleDownload(doc.id, doc.fileName || doc.documentName)}
                                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-lg text-xs font-medium transition-colors border border-blue-100"
                                                                title="Download"
                                                            >
                                                                <Download size={14} /> Download
                                                            </button>
                                                            <ActionMenu doc={doc} onPreview={setPreviewDoc} onDownload={handleDownload} />
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </Card>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredDocs.map(doc => (
                                        <motion.div key={doc.id} whileHover={{ y: -4 }}>
                                            <Card className="h-full flex flex-col group overflow-hidden">
                                                <div className="h-40 bg-slate-100 relative cursor-pointer" onClick={() => setPreviewDoc(doc)}>
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-slate-900/10 transition-opacity">
                                                        <div className="bg-white p-2 rounded-full shadow-sm"><Eye size={20} className="text-slate-700"/></div>
                                                    </div>
                                                    <img src={doc.thumbnail} alt="thumb" className="w-full h-full object-cover opacity-50 mix-blend-multiply" />
                                                    <div className="absolute top-3 left-3"><Badge status={doc.status}/></div>
                                                </div>
                                                <CardContent className="p-5 flex-1 flex flex-col justify-between">
                                                    <div>
                                                        <h4 className="font-semibold text-slate-800 line-clamp-1 hover:text-blue-600 cursor-pointer" onClick={() => setPreviewDoc(doc)}>{doc.documentName || doc.name}</h4>
                                                        <p className="text-xs text-slate-500 mt-1">{doc.documentType || doc.category} • {doc.size || 'N/A'}</p>
                                                    </div>
                                                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                                                        <p className="text-xs text-slate-400">{new Date(doc.uploadedAt || doc.uploadDate).toLocaleDateString()}</p>
                                                        <div className="flex items-center gap-2">
                                                            <button 
                                                                onClick={() => handleDownload(doc.id, doc.fileName || doc.documentName)}
                                                                className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors border border-blue-100"
                                                                title="Download"
                                                            >
                                                                <Download size={16} />
                                                            </button>
                                                            <ActionMenu doc={doc} onPreview={setPreviewDoc} onDownload={handleDownload} />
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Right Sidebar Activity */}
                <div className="hidden xl:block w-80 shrink-0">
                    <Card className="sticky top-24">
                        <div className="px-6 py-5 border-b border-slate-100">
                            <h3 className="font-semibold text-slate-800">Recent Activity</h3>
                        </div>
                        <CardContent className="p-6">
                            <div className="space-y-6">
                                {activity.map((act, i) => (
                                    <div key={act.id} className="flex gap-4 relative">
                                        {i !== activity.length - 1 && <div className="absolute left-4 top-8 bottom-[-24px] w-px bg-slate-100"></div>}
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                                            act.type === 'upload' ? 'bg-blue-100 text-blue-600' :
                                            act.type === 'approve' ? 'bg-green-100 text-green-600' :
                                            act.type === 'reject' ? 'bg-red-100 text-red-600' : 'bg-purple-100 text-purple-600'
                                        }`}>
                                            {act.type === 'upload' && <Upload size={14} />}
                                            {act.type === 'approve' && <CheckCircle size={14} />}
                                            {act.type === 'reject' && <XCircle size={14} />}
                                            {act.type === 'share' && <Share2 size={14} />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-800">{act.action}</p>
                                            <p className="text-xs text-slate-500 mt-1 line-clamp-1">{act.docName}</p>
                                            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">{act.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>

            {/* Preview Modal */}
            <AnimatePresence>
                {previewDoc && <PreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} onDownload={handleDownload} />}
            </AnimatePresence>

        </div>
    );
};

export default MyDocuments;
