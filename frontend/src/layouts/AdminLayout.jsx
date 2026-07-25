import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-blue-50 to-slate-100">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;