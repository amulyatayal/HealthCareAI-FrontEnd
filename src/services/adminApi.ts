import type {
  PathwayStageResource,
  CreatePathwayResourceRequest,
  UpdatePathwayResourceRequest,
  AdminLoginResponse,
  AccessCode,
  AccessCodeListResponse,
} from '../types/admin';

const API_BASE = '/api/v2/admin';

class AdminApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'AdminApiError';
  }
}

function getAdminToken(): string | null {
  return localStorage.getItem('admin_auth_token');
}

async function fetchAdminJson<T>(url: string, options?: RequestInit): Promise<T> {
  const token = getAdminToken();
  const hasBody = options?.body != null;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...(hasBody && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));

    if (response.status === 401) {
      localStorage.removeItem('admin_auth_token');
      localStorage.removeItem('admin_user');
      window.dispatchEvent(new CustomEvent('admin:session-expired'));
    }

    throw new AdminApiError(response.status, error.detail || error.message || 'An error occurred');
  }

  if (response.status === 204) return {} as T;

  return response.json();
}

// Auth
export async function adminLogin(email: string, password: string): Promise<AdminLoginResponse> {
  return fetchAdminJson<AdminLoginResponse>(`${API_BASE}/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

// Pathway Resources CRUD
export async function getPathwayResources(): Promise<{ resources: PathwayStageResource[] }> {
  return fetchAdminJson(`${API_BASE}/pathway-resources`);
}

export async function createPathwayResource(
  data: CreatePathwayResourceRequest
): Promise<PathwayStageResource> {
  return fetchAdminJson(`${API_BASE}/pathway-resources`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updatePathwayResource(
  id: string,
  data: UpdatePathwayResourceRequest
): Promise<PathwayStageResource> {
  return fetchAdminJson(`${API_BASE}/pathway-resources/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deletePathwayResource(id: string): Promise<{ message: string }> {
  return fetchAdminJson(`${API_BASE}/pathway-resources/${id}`, {
    method: 'DELETE',
  });
}

// Access Codes CRUD
export async function getAccessCodes(): Promise<AccessCodeListResponse> {
  return fetchAdminJson(`${API_BASE}/access-codes`);
}

export async function createAccessCode(hospitalId: string): Promise<AccessCode> {
  return fetchAdminJson(`${API_BASE}/access-codes`, {
    method: 'POST',
    body: JSON.stringify({ hospital_id: hospitalId }),
  });
}

export async function deleteAccessCode(code: string): Promise<{ message: string }> {
  return fetchAdminJson(`${API_BASE}/access-codes/${encodeURIComponent(code)}`, {
    method: 'DELETE',
  });
}

export { AdminApiError };
