import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ZoomIn, ZoomOut, RotateCw, Download, Check, X, AlertCircle, Info, Clock, AlertTriangle, Activity } from 'lucide-react';
import { superAdminService } from './services/superAdminService';
import ToastContainer from './components/Toast';
import useToast from './hooks/useToast';

const DocumentReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState('');
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const data = await superAdminService.getDocumentById(id);
        setDoc(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, [id]);

  const handleAction = async (status) => {
    if (status === 'Rejected' && !remarks.trim()) {
      addToast('Remarks are required for rejection', 'error');
      return;
    }
    setActionLoading(true);
    try {
      await superAdminService.updateDocumentStatus(id, status, remarks);
      addToast(`Document ${status.toLowerCase()} successfully!`, 'success');
      setTimeout(() => navigate('/superadmin/verification-queue'), 1000);
    } catch (err) {
      addToast('Failed to update document status', 'error');
      setActionLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (!doc) return <div className="p-6 text-center text-slate-500">Document not found</div>;

  return (
    <div className="space-y-4">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="flex items-center mb-4">
        <button onClick={() => navigate(-1)} className="mr-3 p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-slate-800">Review Document: {doc.id}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        {/* Left: Viewer */}
        <div className="lg:col-span-2 bg-slate-900 rounded-xl overflow-hidden flex flex-col shadow-lg">
          <div className="bg-slate-800 px-4 py-3 flex items-center justify-between text-slate-300">
            <span className="text-sm font-medium">{doc.type}</span>
            <div className="flex space-x-2">
              <button onClick={() => setZoom(z => Math.max(0.5, z - 0.2))} className="p-1.5 hover:bg-slate-700 rounded"><ZoomOut size={16} /></button>
              <button onClick={() => setZoom(z => Math.min(3, z + 0.2))} className="p-1.5 hover:bg-slate-700 rounded"><ZoomIn size={16} /></button>
              <button onClick={() => setRotation(r => r + 90)} className="p-1.5 hover:bg-slate-700 rounded"><RotateCw size={16} /></button>
              <button className="p-1.5 hover:bg-slate-700 rounded"><Download size={16} /></button>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center p-8 overflow-auto relative">
            {/* Mock Image/PDF */}
            <div 
              style={{ transform: `scale(${zoom}) rotate(${rotation}deg)`, transition: 'transform 0.2s' }}
              className="bg-white w-full max-w-lg aspect-[1/1.4] shadow-2xl rounded-sm flex flex-col p-8"
            >
              <div className="border-b-2 border-slate-200 pb-4 mb-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">{doc.issuer}</h2>
                <span className="text-slate-400">LOGO</span>
              </div>
              <div className="flex-1 space-y-4">
                <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                <div className="mt-8 flex justify-center">
                  <div className="h-32 w-32 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">Photo</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Details & Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* OCR Result section */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-blue-900 flex items-center">
                  <Activity size={16} className="mr-2" /> OCR AI Results
                </h3>
                <span className={`text-xs font-bold px-2 py-1 rounded ${doc.confidenceScore > 85 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {doc.confidenceScore}% Match
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Extracted Name:</span> <span className="font-medium text-slate-800">{doc.userName}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Doc Number:</span> <span className="font-medium text-slate-800">XXXX-XXXX-1234</span></div>
                {doc.confidenceScore < 80 && (
                  <div className="mt-3 bg-red-50 text-red-700 p-2 rounded text-xs flex items-start">
                    <AlertTriangle size={14} className="mr-1 mt-0.5 flex-shrink-0" />
                    Low confidence score. Manual verification highly recommended.
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div>
              <h3 className="font-semibold text-slate-800 mb-3 border-b border-slate-100 pb-2">User Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">User ID:</span> <span className="font-medium">{doc.userId}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Name:</span> <span className="font-medium">{doc.userName}</span></div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 mb-3 border-b border-slate-100 pb-2">Document Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Type:</span> <span className="font-medium">{doc.type}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Issuer:</span> <span className="font-medium">{doc.issuer}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Upload Date:</span> <span className="font-medium">{new Date(doc.uploadDate).toLocaleString()}</span></div>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="font-semibold text-slate-800 mb-3 border-b border-slate-100 pb-2">Timeline</h3>
              <div className="space-y-4">
                <div className="flex">
                  <div className="flex flex-col items-center mr-3">
                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    <div className="w-px h-full bg-slate-200 my-1"></div>
                  </div>
                  <div className="pb-2">
                    <p className="text-sm font-medium text-slate-800">Document Uploaded</p>
                    <p className="text-xs text-slate-500">{new Date(doc.uploadDate).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex flex-col items-center mr-3">
                    <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">Under Review</p>
                    <p className="text-xs text-slate-500">Current Status</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50">
            <div className="mb-4">
              <label className="block text-xs font-medium text-slate-700 mb-1">Remarks (Required for rejection)</label>
              <textarea 
                className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                rows="2"
                placeholder="Enter remarks..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              ></textarea>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleAction('Approved')} 
                disabled={actionLoading}
                className="flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Check size={16} className="mr-1.5" /> {actionLoading ? 'Processing...' : 'Approve'}
              </button>
              <button 
                onClick={() => handleAction('Rejected')} 
                disabled={actionLoading}
                className="flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <X size={16} className="mr-1.5" /> {actionLoading ? 'Processing...' : 'Reject'}
              </button>
            </div>
            <button onClick={() => handleAction('Escalated')} className="mt-3 w-full flex items-center justify-center px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors">
              <AlertCircle size={16} className="mr-1.5 text-slate-500" /> Escalate to Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentReview;