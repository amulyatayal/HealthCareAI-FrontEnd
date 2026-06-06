import type {
  PathwayStageResource,
  CreatePathwayResourceRequest,
  UpdatePathwayResourceRequest,
  AdminLoginResponse,
  AccessCode,
  AccessCodeListResponse,
  AdminNotification,
  AdminNotificationListResponse,
  NotificationCreateRequest,
  AdminEventListResponse,
  EventCreateRequest,
  EventUpdateRequest,
  EventCreateResponse,
  EventUpdateResponse,
} from '../types/admin';

const API_BASE = '/api/v2/admin';

class AdminApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'AdminApiError';
  }
}

function messageFromErrorBody(error: { detail?: unknown; message?: string }): string {
  const d = error.detail;
  if (Array.isArray(d)) {
    return d
      .map((e: { msg?: string }) => (typeof e === 'object' && e && 'msg' in e ? (e as { msg: string }).msg : String(e)))
      .filter(Boolean)
      .join(' ') || (error.message ?? 'An error occurred');
  }
  if (typeof d === 'string' && d.trim()) return d;
  if (d != null && typeof d === 'object') {
    try {
      return JSON.stringify(d);
    } catch {
      return error.message || 'An error occurred';
    }
  }
  return error.message || 'An error occurred';
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

    throw new AdminApiError(response.status, messageFromErrorBody(error));
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

// Notifications CRUD
export async function getAdminNotifications(): Promise<AdminNotificationListResponse> {
  return fetchAdminJson(`${API_BASE}/notifications`);
}

export async function createNotification(data: NotificationCreateRequest): Promise<AdminNotification> {
  return fetchAdminJson(`${API_BASE}/notifications`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteNotification(id: string): Promise<{ message: string }> {
  return fetchAdminJson(`${API_BASE}/notifications/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

// Community Events CRUD
export interface GetAdminEventsParams {
  status?: 'all' | 'published' | 'cancelled';
  limit?: number;
  offset?: number;
}

export async function getAdminEvents(params: GetAdminEventsParams = {}): Promise<AdminEventListResponse> {
  const { status = 'all', limit = 50, offset = 0 } = params;
  const query = new URLSearchParams({
    status,
    limit: String(limit),
    offset: String(offset),
  });
  return fetchAdminJson(`${API_BASE}/events?${query}`);
}

export async function createEvent(data: EventCreateRequest): Promise<EventCreateResponse> {
  return fetchAdminJson(`${API_BASE}/events`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateEvent(id: string, data: EventUpdateRequest): Promise<EventUpdateResponse> {
  return fetchAdminJson(`${API_BASE}/events/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function cancelEvent(id: string): Promise<{ message: string }> {
  return fetchAdminJson(`${API_BASE}/events/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

// Patient Shares (shared data from associated patients)
export interface PatientShareEntry {
  share_id: string;
  patient_ref_id: string;
  created_at: string;
  expires_at: string;
  revoked_at?: string | null;
  scope: Record<string, boolean>;
  token?: string | null;
}

export interface PatientSharesResponse {
  shares: PatientShareEntry[];
}

export async function getPatientShares(): Promise<PatientSharesResponse> {
  return fetchAdminJson(`${API_BASE}/patient-shares`);
}

export { AdminApiError };
