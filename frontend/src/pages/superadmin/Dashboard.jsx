import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, CheckCircle, XCircle, Clock, Users, Percent, Timer, RotateCcw,
  TrendingUp, Activity, Bell
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { superAdminService } from './services/superAdminService';
import ToastContainer from './components/Toast';
import useToast from './hooks/useToast';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        {trend && (
          <p className="text-xs text-green-600 mt-2 flex items-center font-medium">
            <TrendingUp size={14} className="mr-1" /> {trend}
          </p>
        )}
      </div>
      <div className={`h-12 w-12 rounded-full flex items-center justify-center ${color}`}>
        <Icon size={24} />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [s, c, cat, act] = await Promise.all([
        superAdminService.getDashboardStats(),
        superAdminService.getChartData(),
        superAdminService.getCategoryData(),
        superAdminService.getRecentActivities()
      ]);
      setStats(s);
      setCharts(c);
      setCategories(cat);
      setActivities(act);
      addToast('Dashboard data refreshed successfully', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [s, c, cat, act] = await Promise.all([
          superAdminService.getDashboardStats(),
          superAdminService.getChartData(),
          superAdminService.getCategoryData(),
          superAdminService.getRecentActivities()
        ]);
        setStats(s);
        setCharts(c);
        setCategories(cat);
        setActivities(act);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const COLORS = ['#2563EB', '#16A34A', '#F59E0B', '#DC2626'];

  if (loading || !stats) {
    return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Overview of verification metrics and system status.</p>
        </div>
        <button 
          onClick={fetchData}
          className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <RotateCcw size={16} className="mr-2 text-slate-500" />
          Refresh Data
        </button>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Pending Documents" value={stats.pendingDocuments} icon={FileText} color="bg-blue-100 text-blue-600" trend="+12% from yesterday" />
        <StatCard title="Approved Today" value={stats.approvedToday} icon={CheckCircle} color="bg-green-100 text-green-600" trend="+5% from yesterday" />
        <StatCard title="Rejected Today" value={stats.rejectedToday} icon={XCircle} color="bg-red-100 text-red-600" />
        <StatCard title="Pending Reviews" value={stats.pendingReviews} icon={Clock} color="bg-amber-100 text-amber-600" />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm flex items-center">
           <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-4">
             <Users size={24} />
           </div>
           <div>
             <p className="text-sm font-medium text-slate-500">Total Users</p>
             <h3 className="text-xl font-bold text-slate-800">{stats.totalUsers.toLocaleString()}</h3>
           </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm flex items-center">
           <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mr-4">
             <Percent size={24} />
           </div>
           <div>
             <p className="text-sm font-medium text-slate-500">Approval Rate</p>
             <h3 className="text-xl font-bold text-slate-800">{stats.approvalRate}%</h3>
           </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm flex items-center">
           <div className="h-12 w-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-4">
             <Timer size={24} />
           </div>
           <div>
             <p className="text-sm font-medium text-slate-500">Avg Review Time</p>
             <h3 className="text-xl font-bold text-slate-800">{stats.avgReviewTime}</h3>
           </div>
        </div>
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Verification Analytics (Weekly)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A34A" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#16A34A" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRejected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Legend iconType="circle" />
                <Area type="monotone" dataKey="approved" stroke="#16A34A" fillOpacity={1} fill="url(#colorApproved)" name="Approved" />
                <Area type="monotone" dataKey="rejected" stroke="#DC2626" fillOpacity={1} fill="url(#colorRejected)" name="Rejected" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Document Categories</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activities & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Recent Activities</h3>
            <button 
              onClick={() => navigate('/superadmin/approval-history')}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <Activity size={16} className="text-slate-500" />
                </div>
                <div className="flex-1 pb-4 border-b border-slate-100">
                  <p className="text-sm text-slate-800">
                    <span className="font-semibold">{activity.user}</span> {activity.action} <span className="font-medium text-blue-600">{activity.target}</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Latest Notifications</h3>
            <button 
              onClick={() => navigate('/superadmin/verification-queue')}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center mr-3 flex-shrink-0">
                  <Bell size={16} className="text-blue-500" />
                </div>
                <div className="flex-1 pb-4 border-b border-slate-100">
                  <p className="text-sm font-medium text-slate-800">System Update</p>
                  <p className="text-sm text-slate-600 mt-1">New monthly report is ready to download.</p>
                  <p className="text-xs text-slate-400 mt-1">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;