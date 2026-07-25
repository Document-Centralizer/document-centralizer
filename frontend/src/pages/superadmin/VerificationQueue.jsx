import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, RefreshCw, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { superAdminService } from './services/superAdminService';

const StatusBadge = ({ status }) => {
  const styles = {
    'Pending': 'bg-slate-100 text-slate-700',
    'Under Review': 'bg-amber-100 text-amber-700',
    'Approved': 'bg-green-100 text-green-700',
    'Rejected': 'bg-red-100 text-red-700',
    'Returned': 'bg-blue-100 text-blue-700',
    'Escalated': 'bg-purple-100 text-purple-700'
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || styles['Pending']}`}>
      {status}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const styles = {
    'High': 'text-red-600 bg-red-50 border-red-200',
    'Medium': 'text-amber-600 bg-amber-50 border-amber-200',
    'Low': 'text-green-600 bg-green-50 border-green-200'
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${styles[priority]}`}>
      {priority}
    </span>
  );
};

const VerificationQueue = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const data = await superAdminService.getDocuments({ search: searchTerm, status: statusFilter });
      setDocuments(data);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [searchTerm, statusFilter]);

  const filteredDocs = useMemo(() => documents, [documents]);
  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);
  const currentDocs = filteredDocs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl border border-slate-100 shadow-sm min-h-[calc(100vh-8rem)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Verification Queue</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and review uploaded documents.</p>
        </div>
        <button 
          onClick={fetchDocuments}
          className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
        >
          <RefreshCw size={16} className="mr-2" />
          Refresh Queue
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
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
          <Filter size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none bg-white"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Under Review">Under Review</option>
            <option value="Escalated">Escalated</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Document ID</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Issuer</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="px-4 py-8 text-center text-slate-500">
                  <div className="flex justify-center items-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
                </td>
              </tr>
            ) : currentDocs.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-8 text-center text-slate-500">No documents found matching your criteria.</td>
              </tr>
            ) : (
              currentDocs.map(doc => (
                <tr key={doc.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-blue-600">{doc.id}</td>
                  <td className="px-4 py-3">{doc.userName}</td>
                  <td className="px-4 py-3">{doc.type}</td>
                  <td className="px-4 py-3">{doc.issuer}</td>
                  <td className="px-4 py-3"><PriorityBadge priority={doc.priority} /></td>
                  <td className="px-4 py-3"><StatusBadge status={doc.status} /></td>
                  <td className="px-4 py-3 whitespace-nowrap">{new Date(doc.uploadDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <button 
                      onClick={() => navigate(`/superadmin/review/${doc.id}`)}
                      className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      <Eye size={14} className="mr-1" />
                      Review
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-slate-500">
            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredDocs.length)}</span> of <span className="font-medium">{filteredDocs.length}</span> results
          </p>
          <div className="flex space-x-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationQueue;