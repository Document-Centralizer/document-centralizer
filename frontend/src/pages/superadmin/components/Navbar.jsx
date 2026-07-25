import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, User as UserIcon } from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext';
import { logoutUser } from '../../../services/authService';

const Navbar = ({ toggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [allRead, setAllRead] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logoutUser();
    logout();
    navigate('/login');
  };

  const userName = user?.name || 'Super Admin';
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="md:hidden p-2 mr-3 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
          
          {/* Global Search */}
          <div className="hidden sm:flex items-center bg-slate-100 rounded-lg px-3 py-2 w-64 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:bg-white border border-transparent focus-within:border-blue-500 transition-all">
            <Search size={18} className="text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search documents, users..." 
              className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder-slate-400"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors relative"
            >
              <Bell size={20} />
              {!allRead && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-800">Notifications</h3>
                  <button 
                    onClick={() => setAllRead(true)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className={`px-4 py-3 hover:bg-slate-50 border-b border-slate-50 cursor-pointer ${allRead ? 'opacity-60' : ''}`}>
                    <p className="text-sm font-medium text-slate-800">New Document Uploaded</p>
                    <p className="text-xs text-slate-500 mt-1">User USR-2041 uploaded Aadhaar</p>
                    <p className="text-xs text-slate-400 mt-1">5 mins ago</p>
                  </div>
                  <div className={`px-4 py-3 hover:bg-slate-50 border-b border-slate-50 cursor-pointer ${allRead ? 'opacity-60' : ''}`}>
                    <p className="text-sm font-medium text-slate-800">AI Detection Alert</p>
                    <p className="text-xs text-slate-500 mt-1">Low confidence score on DOC-1099</p>
                    <p className="text-xs text-slate-400 mt-1">1 hour ago</p>
                  </div>
                  <div className={`px-4 py-3 hover:bg-slate-50 cursor-pointer ${allRead ? 'opacity-60' : ''}`}>
                    <p className="text-sm font-medium text-slate-800">System Update</p>
                    <p className="text-xs text-slate-500 mt-1">Monthly report generated successfully</p>
                    <p className="text-xs text-slate-400 mt-1">3 hours ago</p>
                  </div>
                </div>
                <div className="px-4 py-2 border-t border-slate-100 text-center">
                  <button 
                    onClick={() => { setShowNotifications(false); navigate('/superadmin/approval-history'); }}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View all activity
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
              className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors focus:outline-none"
            >
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                {userInitials}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-slate-700 leading-none">{userName}</p>
                <p className="text-xs text-slate-500 mt-1">{user?.role || 'Admin'}</p>
              </div>
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50">
                <div className="px-4 py-3 border-b border-slate-100 sm:hidden">
                  <p className="text-sm font-medium text-slate-800">{userName}</p>
                  <p className="text-xs text-slate-500">{user?.role || 'Admin'}</p>
                </div>
                <button 
                  onClick={() => { setShowProfile(false); navigate('/superadmin/profile'); }}
                  className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <UserIcon size={16} className="mr-2" /> Profile
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-slate-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;