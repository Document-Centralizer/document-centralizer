import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Unauthorized from '../pages/Unauthorized';

import UserLayout from '../layouts/UserLayout';
import AdminLayout from '../layouts/AdminLayout';

import UserDashboard from '../pages/user/Dashboard';
import Upload from '../pages/user/Upload';
import MyDocuments from '../pages/user/MyDocuments';
import Pending from '../pages/user/Pending';
import Approved from '../pages/user/Approved';
import Rejected from '../pages/user/Rejected';
import Subscription from '../pages/user/Subscription';
import Profile from '../pages/user/Profile';
import Settings from '../pages/user/Settings';

import AdminDashboard from '../pages/admin/AdminDashboard';

// Import newly generated SuperAdmin module components
import {
  SuperAdminLayout,
  Dashboard as SuperAdminDashboard,
  VerificationQueue,
  DocumentReview,
  ApprovalHistory,
  Reports,
  Profile as SuperAdminProfile
} from '../pages/superadmin';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* User Routes */}
        <Route element={<ProtectedRoute allowedRoles={['user', 'admin', 'superadmin']} />}>
          <Route path="/user" element={<UserLayout />}>
            <Route index element={<UserDashboard />} />
            <Route path="upload" element={<Upload />} />
            <Route path="my-documents" element={<MyDocuments />} />
            <Route path="pending" element={<Pending />} />
            <Route path="approved" element={<Approved />} />
            <Route path="rejected" element={<Rejected />} />
            <Route path="subscription" element={<Subscription />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'superadmin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
          </Route>
        </Route>

        {/* SuperAdmin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['superadmin']} />}>
          <Route path="/superadmin" element={<SuperAdminLayout />}>
            <Route index element={<SuperAdminDashboard />} />
            <Route path="dashboard" element={<SuperAdminDashboard />} />
            <Route path="verification-queue" element={<VerificationQueue />} />
            <Route path="document-review" element={<DocumentReview />} />
            <Route path="review/:id" element={<DocumentReview />} />
            <Route path="approval-history" element={<ApprovalHistory />} />
            <Route path="reports" element={<Reports />} />
            <Route path="profile" element={<SuperAdminProfile />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
