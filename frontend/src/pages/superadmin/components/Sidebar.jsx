import React, { useContext } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileCheck, History, BarChart3, User, LogOut, X } from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext';
import { logoutUser } from '../../../services/authService';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/superadmin/dashboard' },
    { name: 'Verification Queue', icon: <FileCheck size={20} />, path: '/superadmin/verification-queue' },
    { name: 'Approval History', icon: <History size={20} />, path: '/superadmin/approval-history' },
    { name: 'Reports', icon: <BarChart3 size={20} />, path: '/superadmin/reports' },
    { name: 'Profile', icon: <User size={20} />, path: '/superadmin/profile' },
  ];

  const handleLogout = () => {
    logoutUser();
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 md:hidden transition-opacity" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto md:flex md:flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200">
          <span className="text-xl font-bold text-blue-600 truncate">DocuCentral</span>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-slate-500 hover:text-slate-700">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname.includes(item.path);
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <span className={`mr-3 ${isActive ? 'text-blue-700' : 'text-slate-400'}`}>
                    {item.icon}
                  </span>
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-200">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} className="mr-3" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;