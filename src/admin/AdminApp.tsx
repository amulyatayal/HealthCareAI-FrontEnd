import { Routes, Route } from 'react-router-dom';
import { AdminAuthProvider } from './AdminAuthContext';
import { AdminLayout } from './AdminLayout';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminResourcesPage } from './pages/AdminResourcesPage';
import { AdminAccessCodesPage } from './pages/AdminAccessCodesPage';
import { AdminCommunityPage } from './pages/AdminCommunityPage';
import { AdminEventsPage } from './pages/AdminEventsPage';
import { AdminNotificationsPage } from './pages/AdminNotificationsPage';
import { AdminSharedDataPage } from './pages/AdminSharedDataPage';
import { AdminClinicalTeamPage } from './pages/AdminClinicalTeamPage';
import { AdminTermsPage } from './pages/AdminTermsPage';
import './admin.css';

export function AdminApp() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="/login" element={<AdminLoginPage />} />
        <Route path="/terms" element={<AdminTermsPage />} />
        <Route
          path="/*"
          element={
            <AdminLayout>
              <Routes>
                <Route path="/" element={<AdminDashboardPage />} />
                <Route path="/resources" element={<AdminResourcesPage />} />
                <Route path="/access-codes" element={<AdminAccessCodesPage />} />
                <Route path="/community" element={<AdminCommunityPage />} />
                <Route path="/events" element={<AdminEventsPage />} />
                <Route path="/notifications" element={<AdminNotificationsPage />} />
                <Route path="/shared-data" element={<AdminSharedDataPage />} />
                <Route path="/clinical-team" element={<AdminClinicalTeamPage />} />
              </Routes>
            </AdminLayout>
          }
        />
      </Routes>
    </AdminAuthProvider>
  );
}
