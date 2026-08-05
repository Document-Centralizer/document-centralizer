import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ZoomIn, ZoomOut, RotateCw, Download, Check, X, AlertCircle, Info, Clock, AlertTriangle, Activity } from 'lucide-react';
import { superAdminService } from './services/superAdminService';
import ToastContainer from './components/Toast';
import useToast from './hooks/useToast';

const DocumentViewer = ({ docId }) => {
    const [docUrl, setDocUrl] = useState(null);

    useEffect(() => {
        if (docId) {
            superAdminService.downloadDocument(docId)
                .then(res => {
                    const url = URL.createObjectURL(res.data);
                    setDocUrl(url + '#toolbar=0');
                })
                .catch(console.error);
        }
        return () => {
            if (docUrl) URL.revokeObjectURL(docUrl);
        };
    }, [docId]);

    if (!docUrl) return <div className="text-gray-400 flex justify-center items-center h-full">Loading document...</div>;
    return <iframe src={docUrl} className="w-full h-full border-0 rounded-lg bg-white" title="Document Viewer" />;
};

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
  const [syncLoading, setSyncLoading] = useState(false);
  const [authBridgeResult, setAuthBridgeResult] = useState(null);

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

  const handleAuthBridgeSync = async () => {
    setSyncLoading(true);
    try {
      const result = await superAdminService.verifyWithAuthBridge(doc.type, doc.ocrText);
      setAuthBridgeResult(result);
    } catch (err) {
      addToast('AuthBridge Sync Failed', 'error');
    } finally {
      setSyncLoading(false);
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
          </div>
          <div className="flex-1 p-2 bg-slate-900 h-full relative">
             <DocumentViewer docId={doc.id} />
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
                <button 
                  onClick={handleAuthBridgeSync}
                  disabled={syncLoading}
                  className="flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Activity size={14} className="mr-1" /> {syncLoading ? 'Syncing...' : 'AuthBridge Sync'}
                </button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="bg-white p-3 rounded border border-blue-50 text-slate-700 max-h-32 overflow-y-auto whitespace-pre-wrap">
                  {doc.ocrText || <span className="text-slate-400 italic">No OCR text available.</span>}
                </div>
                
                {authBridgeResult && (
                  <div className={`mt-3 p-3 rounded-lg border ${authBridgeResult.status === 'SUCCESS' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                    <h4 className="font-semibold text-sm flex items-center mb-1">
                      {authBridgeResult.status === 'SUCCESS' ? <Check size={14} className="mr-1" /> : <AlertTriangle size={14} className="mr-1" />}
                      AuthBridge {authBridgeResult.status === 'SUCCESS' ? 'Verified' : 'Rejected'}
                    </h4>
                    <p className="text-xs mb-1">{authBridgeResult.message}</p>
                    <p className="text-xs font-semibold">Confidence: {authBridgeResult.confidence}%</p>
                  </div>
                )}
              </div>
            </div>

            {/* Admin Remarks */}
            {doc.remarks && (
              <div>
                <h3 className="font-semibold text-amber-800 mb-3 border-b border-amber-100 pb-2">Admin Remarks</h3>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 text-sm text-amber-900">
                  {doc.remarks}
                </div>
              </div>
            )}

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
                    <p className="text-sm font-medium text-slate-800">Forwarded</p>
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
                onClick={() => handleAction('VERIFIED')} 
                disabled={actionLoading}
                className="flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Check size={16} className="mr-1.5" /> {actionLoading ? 'Processing...' : 'Approve'}
              </button>
              <button 
                onClick={() => handleAction('REJECTED')} 
                disabled={actionLoading}
                className="flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <X size={16} className="mr-1.5" /> {actionLoading ? 'Processing...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentReview;