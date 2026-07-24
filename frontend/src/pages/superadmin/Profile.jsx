import React, { useState, useContext } from 'react';
import { User, Mail, Phone, Shield, Key, Edit3, Save, X, CheckCircle } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import ToastContainer from './components/Toast';
import useToast from './hooks/useToast';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const { toasts, addToast, removeToast } = useToast();

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Super Admin User',
    email: user?.email || 'admin@docucentral.gov.in',
    phone: '+91 98765 43210',
    role: user?.role || 'superadmin',
  });
  const [editData, setEditData] = useState({ ...profileData });

  // Password state
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing
      setEditData({ ...profileData });
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = () => {
    if (!editData.name.trim() || !editData.email.trim()) {
      addToast('Name and email are required', 'error');
      return;
    }
    setProfileData({ ...editData });
    setIsEditing(false);
    addToast('Profile updated successfully!', 'success');
  };

  const handlePasswordUpdate = () => {
    const errors = {};
    
    if (!passwords.current) {
      errors.current = 'Current password is required';
    }
    if (!passwords.new) {
      errors.new = 'New password is required';
    } else if (passwords.new.length < 8) {
      errors.new = 'Password must be at least 8 characters';
    }
    if (!passwords.confirm) {
      errors.confirm = 'Please confirm your new password';
    } else if (passwords.new !== passwords.confirm) {
      errors.confirm = 'Passwords do not match';
    }

    setPasswordErrors(errors);

    if (Object.keys(errors).length === 0) {
      // Simulate password update
      setPasswords({ current: '', new: '', confirm: '' });
      setPasswordErrors({});
      addToast('Password updated successfully!', 'success');
    }
  };

  const userInitials = profileData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <h1 className="text-2xl font-bold text-slate-800 mb-6">Profile Settings</h1>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="h-24 w-24 rounded-full bg-white p-1 shadow-md">
              <div className="h-full w-full rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-700">
                {userInitials}
              </div>
            </div>
            {isEditing ? (
              <div className="flex space-x-2">
                <button 
                  onClick={handleSaveProfile}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  <Save size={16} className="mr-2" /> Save
                </button>
                <button 
                  onClick={handleEditToggle}
                  className="flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
                >
                  <X size={16} className="mr-2" /> Cancel
                </button>
              </div>
            ) : (
              <button 
                onClick={handleEditToggle}
                className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                <Edit3 size={16} className="mr-2" /> Edit Profile
              </button>
            )}
          </div>
          
          <div className="space-y-6">
            {isEditing ? (
              /* Editable Form */
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
            ) : (
              /* Read-only Display */
              <>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{profileData.name}</h2>
                  <p className="text-sm text-slate-500 flex items-center mt-1">
                    <Shield size={14} className="mr-1 text-blue-500" /> System Administrator
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Email Address</p>
                    <p className="text-slate-800 flex items-center">
                      <Mail size={16} className="mr-2 text-slate-400" /> {profileData.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Phone Number</p>
                    <p className="text-slate-800 flex items-center">
                      <Phone size={16} className="mr-2 text-slate-400" /> {profileData.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Role</p>
                    <p className="text-slate-800 flex items-center">
                      <Shield size={16} className="mr-2 text-slate-400" /> Super Admin
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Last Login</p>
                    <p className="text-slate-800 flex items-center">
                      <User size={16} className="mr-2 text-slate-400" /> {new Date().toLocaleDateString('en-IN', { weekday: 'long', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8">
        <div className="flex items-center mb-6">
          <Key size={20} className="mr-3 text-slate-400" />
          <h3 className="text-lg font-bold text-slate-800">Security Settings</h3>
        </div>
        
        <div className="max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={passwords.current}
              onChange={(e) => { setPasswords({ ...passwords, current: e.target.value }); setPasswordErrors({ ...passwordErrors, current: '' }); }}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${passwordErrors.current ? 'border-red-300' : 'border-slate-200'}`}
            />
            {passwordErrors.current && <p className="text-xs text-red-500 mt-1">{passwordErrors.current}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={passwords.new}
              onChange={(e) => { setPasswords({ ...passwords, new: e.target.value }); setPasswordErrors({ ...passwordErrors, new: '' }); }}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${passwordErrors.new ? 'border-red-300' : 'border-slate-200'}`}
            />
            {passwordErrors.new && <p className="text-xs text-red-500 mt-1">{passwordErrors.new}</p>}
            {passwords.new && passwords.new.length >= 8 && !passwordErrors.new && (
              <p className="text-xs text-green-500 mt-1 flex items-center"><CheckCircle size={12} className="mr-1" /> Password strength: Good</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={passwords.confirm}
              onChange={(e) => { setPasswords({ ...passwords, confirm: e.target.value }); setPasswordErrors({ ...passwordErrors, confirm: '' }); }}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${passwordErrors.confirm ? 'border-red-300' : 'border-slate-200'}`}
            />
            {passwordErrors.confirm && <p className="text-xs text-red-500 mt-1">{passwordErrors.confirm}</p>}
          </div>
          <div className="pt-2">
            <button 
              type="button" 
              onClick={handlePasswordUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;