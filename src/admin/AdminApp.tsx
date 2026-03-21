import { Routes, Route } from 'react-router-dom';
import { AdminAuthProvider } from './AdminAuthContext';
import { AdminLayout } from './AdminLayout';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminResourcesPage } from './pages/AdminResourcesPage';
import './admin.css';

export function AdminApp() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="/login" element={<AdminLoginPage />} />
        <Route
          path="/*"
          element={
            <AdminLayout>
              <Routes>
                <Route path="/" element={<AdminDashboardPage />} />
                <Route path="/resources" element={<AdminResourcesPage />} />
              </Routes>
            </AdminLayout>
          }
        />
      </Routes>
    </AdminAuthProvider>
  );
}
