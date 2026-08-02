
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    UploadCloud, FileText, CheckCircle, XCircle, AlertCircle, 
    X, File, Info, Check, ShieldCheck, ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Link } from 'react-router-dom';

const CATEGORIES = [
    "Aadhaar Card", "PAN Card", "Passport", "Driving License", 
    "10th Marksheet", "12th Marksheet", "Degree Certificate", 
    "Birth Certificate", "Income Certificate", "Caste Certificate", "Other"
];

const RECENT_UPLOADS = [
    { id: 1, name: "Aadhaar_Card.pdf", time: "2 mins ago", status: "Uploaded Successfully" },
    { id: 2, name: "Degree_Certificate.pdf", time: "1 hour ago", status: "Pending Verification" },
    { id: 3, name: "Passport.pdf", time: "3 hours ago", status: "Upload Failed" }
];

const Upload = () => {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [uploadState, setUploadState] = useState('idle'); // idle, confirming, uploading, success, error
    const [progress, setProgress] = useState(0);
    const [errorMsg, setErrorMsg] = useState('');
    const inputRef = useRef(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        issueDate: '',
        expiryDate: '',
        tags: ''
    });

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const validateFile = (selectedFile) => {
        if (!selectedFile) return false;
        const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
        if (!validTypes.includes(selectedFile.type)) {
            setErrorMsg("Unsupported file format. Please upload PDF, JPG, or PNG.");
            return false;
        }
        if (selectedFile.size > 10 * 1024 * 1024) {
            setErrorMsg("File is too large. Maximum size is 10 MB.");
            return false;
        }
        setErrorMsg('');
        return true;
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (validateFile(droppedFile)) {
                setFile(droppedFile);
                setFormData(prev => ({ ...prev, name: droppedFile.name.split('.')[0] }));
            }
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (validateFile(selectedFile)) {
                setFile(selectedFile);
                setFormData(prev => ({ ...prev, name: selectedFile.name.split('.')[0] }));
            }
        }
    };

    const onButtonClick = () => {
        inputRef.current.click();
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUploadClick = () => {
        if (!file) {
            setErrorMsg("Please select a file to upload.");
            return;
        }
        if (!formData.category) {
            setErrorMsg("Please select a document category.");
            return;
        }
        setUploadState('confirming');
    };

    const startUpload = async () => {
        setUploadState('uploading');
        setProgress(10); // Initial progress

        try {
            // Get user ID from local storage securely
            const { getUserData } = await import('../../utils/localStorage');
            const user = getUserData();
            if (!user || !user.id) {
                setErrorMsg('User not logged in or invalid session.');
                setUploadState('idle');
                return;
            }

            const formDataToSend = new FormData();
            formDataToSend.append('file', file);
            formDataToSend.append('documentName', formData.name);
            formDataToSend.append('documentType', formData.category);
            if (formData.description) {
                formDataToSend.append('remarks', formData.description);
            }
            formDataToSend.append('userId', user.id);

            // Import api inline or assume it's added to the top
            const { default: api } = await import('../../services/api');
            
            await api.post('/documents/upload', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percentCompleted);
                }
            });

            setUploadState('success');
        } catch (error) {
            console.error('Upload failed:', error);
            setErrorMsg(error.response?.data?.message || 'Failed to upload document. Please try again.');
            setUploadState('idle');
            setProgress(0);
        }
    };

    const resetForm = () => {
        setFile(null);
        setUploadState('idle');
        setProgress(0);
        setErrorMsg('');
        setFormData({ name: '', category: '', description: '', issueDate: '', expiryDate: '', tags: '' });
    };

    return (
        <div className="max-w-7xl mx-auto pb-12">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Upload Document</h1>
                    <p className="text-sm text-slate-500 mt-1">Securely upload and manage your important documents for verification.</p>
                </div>
                <Link to="/user/my-documents" className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-slate-50 transition shadow-sm">
                    View My Documents
                </Link>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                
                {/* LEFT SIDE (70%) */}
                <div className="flex-1 space-y-6">
                    
                    {errorMsg && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
                            <AlertCircle size={20} />
                            <p className="text-sm font-medium">{errorMsg}</p>
                        </motion.div>
                    )}

                    {!file ? (
                        <Card>
                            <CardContent className="p-8">
                                <div 
                                    className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${dragActive ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <input 
                                        ref={inputRef} 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/jpeg, image/png, application/pdf"
                                        onChange={handleChange} 
                                    />
                                    
                                    <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-6 text-blue-500">
                                        <UploadCloud size={32} />
                                    </div>
                                    
                                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Drag & Drop your files here</h3>
                                    <p className="text-slate-500 mb-6">or</p>
                                    
                                    <button onClick={onButtonClick} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-slate-800 transition shadow-sm">
                                        Browse Files
                                    </button>
                                    
                                    <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-400">
                                        <div className="flex items-center gap-2"><File size={16}/> PDF, PNG, JPG</div>
                                        <div className="flex items-center gap-2"><ShieldCheck size={16}/> Max 10 MB</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                            <Card className="border-blue-100 overflow-hidden relative">
                                {uploadState === 'uploading' && (
                                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-8">
                                        <div className="w-16 h-16 border-4 border-slate-100 border-t-blue-500 rounded-full animate-spin mb-6"></div>
                                        <h3 className="text-lg font-semibold text-slate-800 mb-2">Uploading Document...</h3>
                                        <div className="w-full max-w-md bg-slate-100 h-2 rounded-full overflow-hidden mb-2">
                                            <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                                        </div>
                                        <p className="text-sm font-medium text-slate-500">{progress}% Completed</p>
                                    </div>
                                )}

                                {uploadState === 'success' && (
                                    <div className="absolute inset-0 bg-green-50 z-20 flex flex-col items-center justify-center p-8 text-center">
                                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                                            <Check size={40} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-800 mb-2">Document uploaded successfully.</h3>
                                        <p className="text-slate-600 mb-8">Your document has been sent for verification.</p>
                                        <div className="flex gap-4">
                                            <button onClick={resetForm} className="bg-white border border-slate-200 text-slate-700 px-6 py-2.5 rounded-xl font-medium hover:bg-slate-50 transition shadow-sm">
                                                Upload Another
                                            </button>
                                            <Link to="/user/my-documents" className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-slate-800 transition shadow-sm">
                                                View My Documents
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-8 pb-6 border-b border-slate-100">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                                <File size={32} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-slate-800 text-lg">{file.name}</h3>
                                                <p className="text-sm text-slate-500">{(file.size / (1024*1024)).toFixed(2)} MB • {file.type}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setFile(null)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition">
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        <h4 className="font-semibold text-slate-800">Document Details</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Document Name</label>
                                                <input name="name" value={formData.name} onChange={handleFormChange} type="text" className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 text-sm transition bg-slate-50 focus:bg-white" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                                                <select name="category" value={formData.category} onChange={handleFormChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 text-sm transition bg-slate-50 focus:bg-white cursor-pointer">
                                                    <option value="">Select Category</option>
                                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Issue Date (Optional)</label>
                                                <input name="issueDate" value={formData.issueDate} onChange={handleFormChange} type="date" className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 text-sm transition bg-slate-50 focus:bg-white" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Expiry Date (Optional)</label>
                                                <input name="expiryDate" value={formData.expiryDate} onChange={handleFormChange} type="date" className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 text-sm transition bg-slate-50 focus:bg-white" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
                                                <input name="tags" value={formData.tags} onChange={handleFormChange} type="text" placeholder="e.g. personal, tax, important" className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 text-sm transition bg-slate-50 focus:bg-white" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                                                <textarea name="description" value={formData.description} onChange={handleFormChange} rows="3" className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 text-sm transition bg-slate-50 focus:bg-white resize-none"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8 pt-6 border-t border-slate-100 flex gap-4 justify-end">
                                        <button onClick={resetForm} className="px-6 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition">
                                            Cancel
                                        </button>
                                        <button onClick={handleUploadClick} className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition shadow-md shadow-blue-200">
                                            Upload Document
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </div>

                {/* RIGHT SIDEBAR (30%) */}
                <div className="w-full lg:w-80 space-y-6">
                    
                    <Card>
                        <CardHeader title="Upload Guidelines" icon={Info} />
                        <CardContent className="pt-0 space-y-4 text-sm text-slate-600">
                            <div className="flex gap-3"><CheckCircle size={18} className="text-green-500 shrink-0"/> <p>Ensure document is clear and readable.</p></div>
                            <div className="flex gap-3"><CheckCircle size={18} className="text-green-500 shrink-0"/> <p>Maximum allowed file size is 10 MB.</p></div>
                            <div className="flex gap-3"><CheckCircle size={18} className="text-green-500 shrink-0"/> <p>Supported formats: PDF, JPG, PNG.</p></div>
                            <div className="flex gap-3"><CheckCircle size={18} className="text-green-500 shrink-0"/> <p>Name files appropriately (e.g. Aadhaar_Card.pdf).</p></div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader title="Recent Uploads" />
                        <CardContent className="pt-0 space-y-4">
                            {RECENT_UPLOADS.map(doc => (
                                <div key={doc.id} className="flex gap-3 items-start p-3 rounded-xl hover:bg-slate-50 transition cursor-pointer border border-transparent hover:border-slate-100">
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                                        <FileText size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-800 line-clamp-1">{doc.name}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{doc.time}</p>
                                        <div className="mt-1">
                                            <Badge status={doc.status} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                </div>
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {uploadState === 'confirming' && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                    <UploadCloud size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Confirm Upload</h3>
                                <p className="text-slate-500 text-sm mb-6">Are you sure you want to upload this document? It will be sent for verification.</p>
                                
                                <div className="bg-slate-50 rounded-xl p-4 mb-6 space-y-2 text-sm border border-slate-100">
                                    <div className="flex justify-between"><span className="text-slate-500">Name:</span> <span className="font-medium text-slate-800 truncate max-w-[200px]">{formData.name}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Category:</span> <span className="font-medium text-slate-800">{formData.category}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Size:</span> <span className="font-medium text-slate-800">{(file.size / (1024*1024)).toFixed(2)} MB</span></div>
                                </div>
                                
                                <div className="flex gap-3">
                                    <button onClick={() => setUploadState('idle')} className="flex-1 bg-white border border-slate-200 text-slate-700 py-2.5 rounded-xl font-medium hover:bg-slate-50 transition">
                                        Cancel
                                    </button>
                                    <button onClick={startUpload} className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-medium hover:bg-blue-700 transition shadow-md shadow-blue-200">
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default Upload;
