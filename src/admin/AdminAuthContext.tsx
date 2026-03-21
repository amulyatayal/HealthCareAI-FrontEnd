import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { AdminUser } from '../types/admin';

interface AdminAuthState {
  adminUser: AdminUser | null;
  adminToken: string | null;
  isAdminAuthenticated: boolean;
  isLoading: boolean;
  loginError: string | null;
  adminLogin: (email: string, password: string) => Promise<void>;
  adminDemoLogin: () => void;
  adminLogout: () => void;
}

const AdminAuthContext = createContext<AdminAuthState | null>(null);

export function useAdminAuth(): AdminAuthState {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_auth_token');
    const userJson = localStorage.getItem('admin_user');
    if (token && userJson) {
      try {
        setAdminUser(JSON.parse(userJson));
        setAdminToken(token);
      } catch {
        localStorage.removeItem('admin_auth_token');
        localStorage.removeItem('admin_user');
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    function handleExpired() {
      setAdminUser(null);
      setAdminToken(null);
    }
    window.addEventListener('admin:session-expired', handleExpired);
    return () => window.removeEventListener('admin:session-expired', handleExpired);
  }, []);

  const adminLogin = useCallback(async (email: string, password: string) => {
    setLoginError(null);
    try {
      const { adminLogin: apiLogin } = await import('../services/adminApi');
      const result = await apiLogin(email, password);
      localStorage.setItem('admin_auth_token', result.token);
      localStorage.setItem('admin_user', JSON.stringify(result.user));
      setAdminToken(result.token);
      setAdminUser(result.user);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setLoginError(message);
      throw err;
    }
  }, []);

  const adminDemoLogin = useCallback(() => {
    const demoUser: AdminUser = {
      id: 'demo-clinician',
      name: 'Dr. Demo Clinician',
      email: 'demo@hospital.nhs.uk',
      role: 'Consultant Surgeon',
    };
    const demoToken = 'demo_token';
    localStorage.setItem('admin_auth_token', demoToken);
    localStorage.setItem('admin_user', JSON.stringify(demoUser));
    setAdminToken(demoToken);
    setAdminUser(demoUser);
    setLoginError(null);
  }, []);

  const adminLogout = useCallback(() => {
    localStorage.removeItem('admin_auth_token');
    localStorage.removeItem('admin_user');
    setAdminToken(null);
    setAdminUser(null);
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        adminToken,
        isAdminAuthenticated: !!adminToken && !!adminUser,
        isLoading,
        loginError,
        adminLogin,
        adminDemoLogin,
        adminLogout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}
