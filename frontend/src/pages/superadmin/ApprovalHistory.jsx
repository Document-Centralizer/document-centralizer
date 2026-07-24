import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Download, Calendar, FileText, CheckCircle, XCircle, Percent, Eye } from 'lucide-react';
import { superAdminService } from './services/superAdminService';
import { exportToCSV } from './utils/exportUtils';
import ToastContainer from './components/Toast';
import useToast from './hooks/useToast';

const StatusBadge = ({ status }) => {
  const styles = {
    'Approved': 'bg-green-100 text-green-700',
    'Rejected': 'bg-red-100 text-red-700'
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-slate-100 text-slate-700'}`}>
      {status}
    </span>
  );
};

const ApprovalHistory = () => {
  const { toasts, addToast, removeToast } = useToast();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedDoc, setSelectedDoc] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await superAdminService.getDocuments();
        // Filter only approved or rejected
        setDocuments(data.filter(d => d.status === 'Approved' || d.status === 'Rejected'));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredDocs = useMemo(() => {
    let result = documents.filter(d => 
      d.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      d.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Date filtering
    const now = new Date();
    if (dateFilter === '30days') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      result = result.filter(d => new Date(d.uploadDate) >= thirtyDaysAgo);
    } else if (dateFilter === 'month') {
      result = result.filter(d => {
        const docDate = new Date(d.uploadDate);
        return docDate.getMonth() === now.getMonth() && docDate.getFullYear() === now.getFullYear();
      });
    } else if (dateFilter === 'year') {
      result = result.filter(d => new Date(d.uploadDate).getFullYear() === now.getFullYear());
    }

    return result;
  }, [documents, searchTerm, dateFilter]);

  const stats = useMemo(() => {
    const approved = documents.filter(d => d.status === 'Approved').length;
    const rejected = documents.filter(d => d.status === 'Rejected').length;
    const total = documents.length;
    return {
      total,
      approved,
      rejected,
      approvalRate: total > 0 ? ((approved / total) * 100).toFixed(1) : 0,
      rejectionRate: total > 0 ? ((rejected / total) * 100).toFixed(1) : 0,
    };
  }, [documents]);

  const handleExport = () => {
    if (filteredDocs.length === 0) {
      addToast('No data to export', 'error');
      return;
    }
    const columns = [
      { key: 'id', label: 'Document ID' },
      { key: 'userName', label: 'User' },
      { key: 'issuer', label: 'Issuer' },
      { key: 'status', label: 'Decision' },
      { key: 'assignedAdmin', label: 'Approved By' },
      { key: 'uploadDate', label: 'Date' },
      { key: 'remarks', label: 'Remarks' },
    ];
    exportToCSV(filteredDocs, 'approval_history', columns);
    addToast(`Exported ${filteredDocs.length} records to CSV`, 'success');
  };

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Approval History</h1>
          <p className="text-sm text-slate-500 mt-1">View past verification decisions and logs.</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <Download size={16} className="mr-2 text-slate-500" /> Export Report
        </button>
      </div>

      {/* Stats Cards — now dynamic */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
         <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm col-span-2 md:col-span-1">
           <div className="flex items-center text-slate-500 mb-2"><FileText size={16} className="mr-2" /> Total Processed</div>
           <div className="text-2xl font-bold text-slate-800">{stats.total.toLocaleString()}</div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm col-span-2 md:col-span-1">
           <div className="flex items-center text-green-600 mb-2"><CheckCircle size={16} className="mr-2" /> Approved</div>
           <div className="text-2xl font-bold text-slate-800">{stats.approved.toLocaleString()}</div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm col-span-2 md:col-span-1">
           <div className="flex items-center text-red-600 mb-2"><XCircle size={16} className="mr-2" /> Rejected</div>
           <div className="text-2xl font-bold text-slate-800">{stats.rejected.toLocaleString()}</div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
           <div className="flex items-center text-blue-600 mb-2"><Percent size={16} className="mr-2" /> Approval %</div>
           <div className="text-2xl font-bold text-slate-800">{stats.approvalRate}%</div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
           <div className="flex items-center text-orange-600 mb-2"><Percent size={16} className="mr-2" /> Rejection %</div>
           <div className="text-2xl font-bold text-slate-800">{stats.rejectionRate}%</div>
         </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Document ID or User..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="relative w-full sm:w-48">
            <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <select 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
            >
              <option value="all">All Time</option>
              <option value="30days">Last 30 Days</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Document ID</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Issuer</th>
                <th className="px-4 py-3">Decision</th>
                <th className="px-4 py-3">Approved By</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="px-4 py-8 text-center text-slate-500">
                  <div className="flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
                </td></tr>
              ) : filteredDocs.length === 0 ? (
                <tr><td colSpan="7" className="px-4 py-8 text-center text-slate-500">No history found.</td></tr>
              ) : (
                filteredDocs.map(doc => (
                  <tr key={doc.id} className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer" onClick={() => setSelectedDoc(selectedDoc?.id === doc.id ? null : doc)}>
                    <td className="px-4 py-3 font-medium text-blue-600">{doc.id}</td>
                    <td className="px-4 py-3">{doc.userName}</td>
                    <td className="px-4 py-3">{doc.issuer}</td>
                    <td className="px-4 py-3"><StatusBadge status={doc.status} /></td>
                    <td className="px-4 py-3">{doc.assignedAdmin || 'Admin'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{new Date(doc.uploadDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right text-xs text-slate-500 truncate max-w-[150px]">{doc.remarks || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Document Detail Drawer */}
        {selectedDoc && (
          <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 animate-fade-in">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-semibold text-slate-800">Document Details — {selectedDoc.id}</h4>
              <button onClick={() => setSelectedDoc(null)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><span className="text-slate-500">User:</span> <span className="font-medium ml-1">{selectedDoc.userName}</span></div>
              <div><span className="text-slate-500">Type:</span> <span className="font-medium ml-1">{selectedDoc.type}</span></div>
              <div><span className="text-slate-500">Issuer:</span> <span className="font-medium ml-1">{selectedDoc.issuer}</span></div>
              <div><span className="text-slate-500">Priority:</span> <span className="font-medium ml-1">{selectedDoc.priority}</span></div>
              <div><span className="text-slate-500">Confidence:</span> <span className="font-medium ml-1">{selectedDoc.confidenceScore}%</span></div>
              <div><span className="text-slate-500">Reviewed By:</span> <span className="font-medium ml-1">{selectedDoc.assignedAdmin || 'N/A'}</span></div>
              <div className="col-span-2"><span className="text-slate-500">Remarks:</span> <span className="font-medium ml-1">{selectedDoc.remarks || 'No remarks'}</span></div>
            </div>
          </div>
        )}

        {/* Results count */}
        {!loading && (
          <div className="mt-4 text-sm text-slate-500">
            Showing <span className="font-medium">{filteredDocs.length}</span> of <span className="font-medium">{documents.length}</span> records
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalHistory;