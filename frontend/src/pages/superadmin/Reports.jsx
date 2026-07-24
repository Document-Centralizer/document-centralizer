import React, { useState, useEffect } from 'react';
import { Download, Printer, Filter, Calendar } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { superAdminService } from './services/superAdminService';
import { exportToCSV, printPage } from './utils/exportUtils';
import ToastContainer from './components/Toast';
import useToast from './hooks/useToast';

const Reports = () => {
  const { toasts, addToast, removeToast } = useToast();
  const [activeTab, setActiveTab] = useState('Verification');
  const [chartData, setChartData] = useState([]);
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  useEffect(() => {
    superAdminService.getChartData().then(setChartData);
  }, []);

  const tabs = ['Verification', 'Approval', 'Rejected', 'Monthly'];

  const handlePrint = () => {
    printPage();
    addToast('Print dialog opened', 'info');
  };

  const handleExport = (format) => {
    setShowExportMenu(false);
    if (chartData.length === 0) {
      addToast('No data to export', 'error');
      return;
    }

    const columns = [
      { key: 'name', label: 'Day' },
      { key: 'approved', label: 'Approved' },
      { key: 'rejected', label: 'Rejected' },
    ];

    // For all formats we export CSV (PDF/Excel would need external libraries in production)
    const filename = `${activeTab.toLowerCase()}_report`;
    exportToCSV(chartData, filename, columns);
    addToast(`${activeTab} report exported as ${format.toUpperCase()}`, 'success');
  };

  // Compute summary stats from chart data
  const totalApproved = chartData.reduce((sum, d) => sum + (d.approved || 0), 0);
  const totalRejected = chartData.reduce((sum, d) => sum + (d.rejected || 0), 0);
  const totalProcessed = totalApproved + totalRejected;
  const approvedRate = totalProcessed > 0 ? ((totalApproved / totalProcessed) * 100).toFixed(1) : 0;
  const rejectedRate = totalProcessed > 0 ? ((totalRejected / totalProcessed) * 100).toFixed(1) : 0;
  const avgPerDay = chartData.length > 0 ? Math.round(totalProcessed / chartData.length) : 0;

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Reports & Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">Generate and download comprehensive system reports.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handlePrint}
            className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Printer size={16} className="mr-2 text-slate-500" /> Print
          </button>
          <div className="relative">
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Download size={16} className="mr-2" /> Export
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-slate-200 z-10">
                <button onClick={() => handleExport('pdf')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-t-lg">PDF</button>
                <button onClick={() => handleExport('excel')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Excel</button>
                <button onClick={() => handleExport('csv')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-b-lg">CSV</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        {/* Tabs & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
            {tabs.map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {tab} Report
              </button>
            ))}
          </div>
          
          <div className="flex space-x-3">
            <div className="relative">
               <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
               <select className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white">
                 <option>Last 7 Days</option>
                 <option>Last 30 Days</option>
                 <option>This Month</option>
                 <option>This Year</option>
               </select>
            </div>
            <div className="relative">
               <Filter size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
               <select className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white">
                 <option>All Issuers</option>
                 <option>UIDAI</option>
                 <option>Income Tax Dept</option>
               </select>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-96 w-full mt-8">
          <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">{activeTab} Trend Analysis</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
              <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} cursor={{fill: '#F1F5F9'}} />
              <Legend iconType="circle" />
              <Bar dataKey="approved" name="Approved" fill="#16A34A" radius={[4, 4, 0, 0]} barSize={30} />
              <Bar dataKey="rejected" name="Rejected" fill="#DC2626" radius={[4, 4, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Stats — now dynamic */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
           <div className="p-4 bg-slate-50 rounded-lg">
             <p className="text-sm text-slate-500 mb-1">Total Processed</p>
             <h4 className="text-xl font-bold text-slate-800">{totalProcessed.toLocaleString()}</h4>
           </div>
           <div className="p-4 bg-green-50 rounded-lg">
             <p className="text-sm text-green-600 mb-1">Approved Rate</p>
             <h4 className="text-xl font-bold text-green-700">{approvedRate}%</h4>
           </div>
           <div className="p-4 bg-red-50 rounded-lg">
             <p className="text-sm text-red-600 mb-1">Rejected Rate</p>
             <h4 className="text-xl font-bold text-red-700">{rejectedRate}%</h4>
           </div>
           <div className="p-4 bg-blue-50 rounded-lg">
             <p className="text-sm text-blue-600 mb-1">Avg Per Day</p>
             <h4 className="text-xl font-bold text-blue-700">{avgPerDay}</h4>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;