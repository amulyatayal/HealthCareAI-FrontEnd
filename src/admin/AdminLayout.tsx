import { type ReactNode } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, FolderOpen, Share2, KeyRound, LogOut, Heart } from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';

interface Props {
  children: ReactNode;
}

const NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, enabled: true },
  { path: '/admin/resources', label: 'Pathway Resources', icon: FolderOpen, enabled: true },
  { path: '/admin/shared-data', label: 'Shared Patient Data', icon: Share2, enabled: false },
  { path: '/admin/access-codes', label: 'Access Codes', icon: KeyRound, enabled: false },
];

export function AdminLayout({ children }: Props) {
  const { isAdminAuthenticated, isLoading, adminUser, adminLogout } = useAdminAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="admin-loading">Loading...</div>;
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <div className="admin-brand-row">
            <div className="admin-brand-heart">
              <Heart size={18} fill="currentColor" />
              <span className="admin-brand-sparkle">✦</span>
            </div>
            <h2>Tara Admin</h2>
          </div>
          <span>Clinician Portal</span>
        </div>

        <nav className="admin-sidebar-nav">
          <div className="admin-nav-section-label">Navigation</div>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.enabled ? item.path : '#'}
              className={`admin-nav-item ${isActive(item.path) ? 'active' : ''} ${!item.enabled ? 'disabled' : ''}`}
              onClick={(e) => !item.enabled && e.preventDefault()}
            >
              <item.icon size={18} />
              {item.label}
              {!item.enabled && <span className="admin-dash-card-badge">Soon</span>}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-user-name">{adminUser?.name || 'Clinician'}</div>
            <div className="admin-user-role">{adminUser?.role || 'Admin'}</div>
          </div>
          <button className="admin-logout-btn" onClick={adminLogout} title="Sign out">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      <main className="admin-content">{children}</main>
    </div>
  );
}
