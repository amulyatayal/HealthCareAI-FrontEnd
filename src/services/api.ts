import type {
  ChatRequest,
  ChatResponse,
  ChatRequestV1,
  ChatResponseV1,
  ChatRequestV2,
  ChatResponseV2,
  KnowledgeSearchRequest,
  KnowledgeSearchResponse,
  TopicsResponse,
  KnowledgeDocument,
  ChatHistory,
  FeedbackRequest,
  HealthStatus,
  IndexesResponse,
  PatientEvent,
  PatientEventListResponse,
  PatientEventRsvpResponse,
  ClinicalTeamResponse,
} from '../types';

const API_BASE_V1 = '/api/v1';
const API_BASE_V2 = '/api/v2';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface ApiErrorWithConsent extends ApiError {
  consentType?: string;
}

export function isConsentError(err: unknown): err is ApiErrorWithConsent {
  return err instanceof ApiError && err.status === 403 && !!(err as ApiErrorWithConsent).consentType;
}

// Get auth token from localStorage
function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

// Get user ID from guest token or return null for Google auth
function getUserId(): string | null {
  const token = getAuthToken();
  if (token && token.startsWith('guest:')) {
    try {
      const data = JSON.parse(atob(token.substring(6)));
      return data.id;
    } catch {
      return null;
    }
  }
  return null;
}

function formatApiDetail(detail: unknown): string | undefined {
  if (typeof detail === 'string') return detail;
  if (detail != null && typeof detail === 'object' && !Array.isArray(detail)) {
    if ('message' in detail && typeof (detail as { message: unknown }).message === 'string') {
      return (detail as { message: string }).message;
    }
  }
  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => {
        if (typeof item === 'object' && item !== null && 'msg' in item) {
          return String((item as { msg: unknown }).msg);
        }
        return typeof item === 'string' ? item : undefined;
      })
      .filter(Boolean);
    return messages.length > 0 ? messages.join(' ') : undefined;
  }
  return undefined;
}

function consentTypeFromError(error: { consent_type?: string; detail?: unknown }): string | undefined {
  if (typeof error.consent_type === 'string') return error.consent_type;
  const detail = error.detail;
  if (detail != null && typeof detail === 'object' && !Array.isArray(detail) && 'consent_type' in detail) {
    const ct = (detail as { consent_type: unknown }).consent_type;
    return typeof ct === 'string' ? ct : undefined;
  }
  return undefined;
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const userId = getUserId();

  const hospitalId = localStorage.getItem('selected_hospital');

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && !token.startsWith('guest:') && { 'Authorization': `Bearer ${token}` }),
      ...(userId && { 'X-User-ID': userId }),
      ...(hospitalId && { 'X-Hospital-Id': hospitalId }),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));

    // 401 — unauthorized / session expired
    if (response.status === 401) {
      const tokenSetTime = localStorage.getItem('auth_token_set_time');
      const now = Date.now();
      const isRecentlySet = tokenSetTime && (now - parseInt(tokenSetTime)) < 5000;

      if (!isRecentlySet) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_token_set_time');
        window.dispatchEvent(new CustomEvent('auth:session-expired'));
        if (!window.location.pathname.includes('/login')) {
          setTimeout(() => { window.location.reload(); }, 100);
        }
      }
    }

    // 403 — consent required or guest blocked
    const consentType = consentTypeFromError(error);
    if (response.status === 403 && consentType) {
      const apiErr = new ApiError(
        response.status,
        formatApiDetail(error.detail) || error.message || 'Consent required'
      );
      (apiErr as ApiErrorWithConsent).consentType = consentType;
      throw apiErr;
    }

    throw new ApiError(
      response.status,
      formatApiDetail(error.detail) || error.message || 'An error occurred',
    );
  }

  return response.json();
}

// Chat API
// v1 Chat API (kept for compatibility)
export async function sendMessageV1(request: ChatRequestV1): Promise<ChatResponseV1> {
  return fetchJson<ChatResponseV1>(`${API_BASE_V1}/chat`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

// v2 Chat API
export async function sendMessageV2(request: ChatRequestV2): Promise<ChatResponseV2> {
  return fetchJson<ChatResponseV2>(`${API_BASE_V2}/chat/`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

// Default export for legacy callers (v1)
export async function sendMessage(request: ChatRequest): Promise<ChatResponse> {
  return sendMessageV1(request);
}

export async function getChatHistory(sessionId: string): Promise<ChatHistory> {
  return fetchJson<ChatHistory>(`${API_BASE_V1}/chat/history/${sessionId}`);
}

export async function clearChatHistory(sessionId: string): Promise<{ message: string }> {
  return fetchJson<{ message: string }>(`${API_BASE_V1}/chat/history/${sessionId}`, {
    method: 'DELETE',
  });
}

export async function submitFeedback(request: FeedbackRequest): Promise<{ message: string }> {
  return fetchJson<{ message: string }>(`${API_BASE_V1}/chat/feedback`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

// Knowledge API
export async function searchKnowledge(request: KnowledgeSearchRequest): Promise<KnowledgeSearchResponse> {
  return fetchJson<KnowledgeSearchResponse>(`${API_BASE_V1}/knowledge/search`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export async function getTopics(): Promise<TopicsResponse> {
  return fetchJson<TopicsResponse>(`${API_BASE_V1}/knowledge/topics`);
}

export async function getDocument(documentId: string): Promise<KnowledgeDocument> {
  return fetchJson<KnowledgeDocument>(`${API_BASE_V1}/knowledge/document/${documentId}`);
}

// Health API
export async function getHealthStatus(): Promise<HealthStatus> {
  return fetchJson<HealthStatus>('/health');
}

// Indexes API
export async function getAvailableIndexes(): Promise<IndexesResponse> {
  return fetchJson<IndexesResponse>(`${API_BASE_V1}/knowledge/indexes`);
}

// ================================
// Profile API (v2)
// ================================

export interface OnboardingStatusResponse {
  onboarding_completed: boolean;
  current_stage: string;
  needs_onboarding: boolean;
}

export interface OnboardingRequest {
  current_situation: string;
  diagnosis_date?: string;
  diagnosis_type?: string;
  current_treatments?: string[];
  treatment_start_date?: string;
}

export interface ProfileResponse {
  profile: {
    user_id: string;
    current_stage: string;
    onboarding_completed: boolean;
  };
  message: string;
}

export async function getOnboardingStatus(): Promise<OnboardingStatusResponse> {
  return fetchJson<OnboardingStatusResponse>(`${API_BASE_V2}/profile/status`);
}

export async function submitOnboarding(data: OnboardingRequest): Promise<ProfileResponse> {
  return fetchJson<ProfileResponse>(`${API_BASE_V2}/profile/onboarding`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateStage(newStage: string): Promise<ProfileResponse> {
  return fetchJson<ProfileResponse>(`${API_BASE_V2}/profile/stage`, {
    method: 'PUT',
    body: JSON.stringify({ new_stage: newStage }),
  });
}

// Link an existing account via Patient Reference ID
export async function linkAccount(patientRefId: string): Promise<ProfileResponse> {
  return fetchJson<ProfileResponse>(`${API_BASE_V2}/profile/link`, {
    method: 'POST',
    body: JSON.stringify({ patient_ref_id: patientRefId }),
  });
}

// ================================
// Treatment Stage API (v2)
// ================================

export interface TreatmentStage {
  stage_id: string;
  name: string;
  description: string;
  parent_stage_id: string | null;
  child_stage_ids: string[];
  transition_notes: string | null;
  is_patient_facing: boolean;
}

export interface StageTreeNode {
  stage: TreatmentStage;
  children: StageTreeNode[];
}

export interface StageTreeResponse {
  stages: StageTreeNode[];
  total_count: number;
}

export interface StageDetailResponse {
  stage: TreatmentStage;
  parent: TreatmentStage | null;
  children: TreatmentStage[];
  breadcrumb: string[];
}

// Get hierarchical stage tree for UI selector
export async function getStageTree(): Promise<StageTreeResponse> {
  return fetchJson<StageTreeResponse>(`${API_BASE_V2}/profile/stages`);
}

// Get details for a specific stage
export async function getStageDetails(stageId: string): Promise<StageDetailResponse> {
  return fetchJson<StageDetailResponse>(`${API_BASE_V2}/profile/stages/${stageId}`);
}

// Select a detailed treatment stage
export async function selectDetailedStage(stageId: string): Promise<{ message: string; stage_id: string; stage_name: string; breadcrumb: string[] }> {
  return fetchJson(`${API_BASE_V2}/profile/stage/select`, {
    method: 'PUT',
    body: JSON.stringify({ stage_id: stageId }),
  });
}

// Get current user's stage with context
export async function getMyStage(): Promise<{ stage_id: string | null; stage_name: string; breadcrumb: string[]; description?: string; ai_context?: string }> {
  return fetchJson(`${API_BASE_V2}/profile/my-stage`);
}

// ================================
// Dashboard API (v2)
// ================================

export interface DashboardSummary {
  wellness_score: number;
  streak_days: number;
  avg_mood: number;
  trend_direction: 'up' | 'down' | 'stable';
  trend_percentage: number;
  next_appointment: {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
  } | null;
  daily_quote: { text: string; author: string } | null;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return fetchJson<DashboardSummary>(`${API_BASE_V2}/dashboard/summary`);
}

// ================================
// Mood Tracking API (v2)
// ================================

export interface MoodEntry {
  entry_id: string;
  entry_type?: 'basic' | 'advanced';
  mood_score?: number;
  note: string | null;
  emotions: string[] | null;
  triggers: string[] | null;
  quick_check: {
    sleep_quality?: number;
    physical_discomfort?: number;
    energy_level?: number;
  } | null;
  timestamp: string;
}

export interface MoodLogRequest {
  entry_type?: 'basic' | 'advanced';
  mood_score?: number;
  note?: string;
  emotions?: string[];
  triggers?: string[];
  quick_check?: {
    sleep_quality?: number;
    physical_discomfort?: number;
    energy_level?: number;
  };
  timestamp?: string;
}

export interface MoodHistoryResponse {
  entries: MoodEntry[];
  total_count: number;
  avg_mood: number;
  trend_direction: 'up' | 'down' | 'stable';
  trend_percentage: number;
}

export async function logMood(data: MoodLogRequest): Promise<{ id: string; message: string }> {
  return fetchJson(`${API_BASE_V2}/mood`, { method: 'POST', body: JSON.stringify(data) });
}

export async function getMoodHistory(limit: number = 30): Promise<MoodHistoryResponse> {
  return fetchJson<MoodHistoryResponse>(`${API_BASE_V2}/mood?limit=${limit}`);
}

// ================================
// Symptom Tracking API (v2)
// ================================

export interface SymptomEntry {
  entry_id: string;
  symptom_name: string;
  severity: number;
  notes: string | null;
  timestamp: string;
}

export interface SymptomLogRequest {
  symptom_name: string;
  severity: number;
  notes?: string;
  timestamp?: string;
}

export async function logSymptom(data: SymptomLogRequest): Promise<{ id: string; message: string }> {
  return fetchJson(`${API_BASE_V2}/symptoms`, { method: 'POST', body: JSON.stringify(data) });
}

export async function getSymptomHistory(limit: number = 30): Promise<{ entries: SymptomEntry[]; total_count: number }> {
  return fetchJson(`${API_BASE_V2}/symptoms?limit=${limit}`);
}

export async function getSymptomTrends(): Promise<{ trends: { symptom_name: string; direction: string; change_percentage: number }[] }> {
  return fetchJson(`${API_BASE_V2}/symptoms/trends`);
}

// ================================
// Appointments API (v2)
// ================================

export interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  reminder: boolean;
  status: 'upcoming' | 'past' | 'cancelled';
}

export interface CreateAppointmentRequest {
  title: string;
  date: string;
  time: string;
  location?: string;
  reminder?: boolean;
}

export async function getAppointments(status?: string): Promise<{ appointments: Appointment[]; total_count: number }> {
  const params = status ? `?status=${status}` : '';
  return fetchJson(`${API_BASE_V2}/appointments${params}`);
}

export async function createAppointment(data: CreateAppointmentRequest): Promise<{ id: string; message: string }> {
  return fetchJson(`${API_BASE_V2}/appointments`, { method: 'POST', body: JSON.stringify(data) });
}

export async function deleteAppointment(id: string): Promise<{ message: string }> {
  return fetchJson(`${API_BASE_V2}/appointments/${id}`, { method: 'DELETE' });
}

// ================================
// Notifications API (v2)
// ================================

export interface PatientNotification {
  notification_id?: string;
  id?: string;
  title: string;
  message: string;
  priority: 'info' | 'warning' | 'urgent';
  created_at: string;
  read: boolean;
}

export async function getNotifications(): Promise<{ notifications: PatientNotification[] }> {
  return fetchJson(`${API_BASE_V2}/notifications`);
}

export async function markNotificationRead(id: string): Promise<{ message: string }> {
  return fetchJson(`${API_BASE_V2}/notifications/${encodeURIComponent(id)}/read`, { method: 'PATCH', body: JSON.stringify({}) });
}

export async function markAllNotificationsRead(): Promise<{ message: string }> {
  return fetchJson(`${API_BASE_V2}/notifications/read-all`, { method: 'PATCH', body: JSON.stringify({}) });
}

// ================================
// Documents API (v2)
// ================================

export interface DocumentMeta {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
  size_bytes: number;
}

export async function getDocuments(): Promise<{ documents: DocumentMeta[]; total_count: number; total_size_bytes: number; storage_limit_bytes: number }> {
  return fetchJson(`${API_BASE_V2}/documents`);
}

export async function deleteDocument(id: string): Promise<{ message: string }> {
  return fetchJson(`${API_BASE_V2}/documents/${id}`, { method: 'DELETE' });
}

// ================================
// Clinical Team API (v2)
// ================================

export type TeamMember = import('../types').ClinicalTeamMember;

export async function getClinicalTeam(): Promise<ClinicalTeamResponse> {
  return fetchJson(`${API_BASE_V2}/clinical-team`);
}

// ================================
// Share Data API (v2) — QR Code Flow
// ================================

export interface ShareScope {
  mood?: boolean;
  pathway?: boolean;
  symptoms?: boolean;
  documents_summary?: boolean;
  [key: string]: unknown;
}

export interface ShareGenerateRequest {
  scope?: ShareScope;
}

export interface ShareGenerateResponse {
  share_id: string;
  token: string;
  expires_at: string;
  share_url?: string;
}

export interface ShareViewResponse {
  share_id: string;
  expires_at: string;
  profile_summary: {
    patient_ref_id: string;
    current_stage: string | null;
    hospital_id: string | null;
  };
  scope: ShareScope;
}

export interface ShareHistoryEntry {
  share_id: string;
  created_at: string;
  expires_at: string;
  revoked_at?: string | null;
}

export async function generateShare(data: ShareGenerateRequest): Promise<ShareGenerateResponse> {
  return fetchJson(`${API_BASE_V2}/share/generate`, { method: 'POST', body: JSON.stringify(data) });
}

export async function getShareView(token: string): Promise<ShareViewResponse> {
  const response = await fetch(`${API_BASE_V2}/share/view/${encodeURIComponent(token)}`);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Share not found or expired' }));
    throw new ApiError(response.status, error.detail || 'Share not found or expired');
  }
  return response.json();
}

export async function revokeShare(shareId: string): Promise<{ message: string }> {
  return fetchJson(`${API_BASE_V2}/share/${shareId}`, { method: 'DELETE' });
}

export async function getShareHistory(): Promise<{ shares: ShareHistoryEntry[] }> {
  return fetchJson(`${API_BASE_V2}/share/history`);
}


// ================================
// GDPR / Data Rights API (v2)
// ================================

export interface CookieConsentChoices {
  necessary: true;
  functional: boolean;
  analytics: boolean;
  marketing?: boolean;
}

export async function recordCookieConsent(choices: CookieConsentChoices, source: string): Promise<{ consent_id: string }> {
  return fetchJson(`${API_BASE_V2}/consent/cookies`, {
    method: 'POST',
    body: JSON.stringify({ consent_version: 'v1', choices, timestamp: new Date().toISOString(), source }),
  });
}

export interface DataConsentPayload {
  core_service: true;
  health_data: boolean;
  ai_model_providers: boolean;
  document_storage: boolean;
  community: boolean;
  clinical_sharing: true;
}

export async function recordDataConsent(choices: DataConsentPayload, source: string): Promise<{ consent_id: string }> {
  return fetchJson(`${API_BASE_V2}/consent/data`, {
    method: 'POST',
    body: JSON.stringify({ consent_version: 'v1', choices, timestamp: new Date().toISOString(), source }),
  });
}

export async function withdrawConsent(consentType: string): Promise<{ message: string; consent_type: string; withdrawn_at: string }> {
  return fetchJson(`${API_BASE_V2}/consent/${consentType}`, { method: 'DELETE' });
}

export async function getConsentStatus(): Promise<{
  cookie_consent: { choices: CookieConsentChoices; last_updated: string | null } | null;
  data_consent: { choices: DataConsentPayload; last_updated: string | null } | null;
}> {
  return fetchJson(`${API_BASE_V2}/consent`);
}

// Legacy alias
export interface ConsentChoices {
  necessary: true;
  functional: boolean;
  analytics: boolean;
  marketing?: boolean;
  health_data_processing?: boolean;
}

export async function recordConsent(choices: ConsentChoices, source: string): Promise<{ consent_id: string }> {
  return recordCookieConsent({ necessary: true, functional: choices.functional, analytics: choices.analytics }, source);
}

// ================================
// Activity Log API (v2)
// ================================

export interface ActivityLogEntry {
  id: string;
  type: 'consent_granted' | 'consent_withdrawn' | 'data_shared' | 'data_exported' | 'account_created' | 'document_uploaded' | 'document_deleted' | string;
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export async function getActivityLog(limit: number = 50): Promise<{ activities: ActivityLogEntry[] }> {
  return fetchJson(`${API_BASE_V2}/me/activity-log?limit=${limit}`);
}

// ================================
// Document Upload API (v2)
// ================================

export interface UploadDocumentResponse {
  id: string;
  name: string;
  type: string;
  size: string;
  uploaded_at: string;
  message: string;
}

export async function uploadDocument(file: File, name?: string): Promise<UploadDocumentResponse> {
  const token = getAuthToken();
  const userId = getUserId();
  const formData = new FormData();
  formData.append('file', file);
  if (name) formData.append('name', name);

  const response = await fetch(`${API_BASE_V2}/documents/upload`, {
    method: 'POST',
    headers: {
      ...(token && !token.startsWith('guest:') && { 'Authorization': `Bearer ${token}` }),
      ...(userId && { 'X-User-ID': userId }),
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Upload failed' }));
    if (response.status === 413) throw new ApiError(413, error.detail || 'File too large (max 10 MB)');
    if (response.status === 422) throw new ApiError(422, error.detail || 'Invalid file type');
    if (response.status === 409) throw new ApiError(409, error.detail || 'Storage limit reached');
    throw new ApiError(response.status, error.detail || error.message || 'Upload failed');
  }
  return response.json();
}

// ================================
// Data Export & Account (v2)
// ================================

export async function exportMyData(): Promise<Blob> {
  const token = getAuthToken();
  const userId = getUserId();
  const response = await fetch(`${API_BASE_V2}/me/export`, {
    headers: {
      ...(token && !token.startsWith('guest:') && { 'Authorization': `Bearer ${token}` }),
      ...(userId && { 'X-User-ID': userId }),
    },
  });
  if (!response.ok) throw new ApiError(response.status, 'Export failed');
  return response.blob();
}

export async function deleteMyAccount(confirmation: string): Promise<{ message: string }> {
  return fetchJson(`${API_BASE_V2}/me`, { method: 'DELETE', body: JSON.stringify({ confirmation }) });
}

// ================================
// Patient-facing Resources API (v2)
// ================================

export interface PatientResource {
  title: string;
  description: string;
  url: string;
  type: 'pdf' | 'video' | 'link';
  intents: string[];
}

export async function getAllResources(): Promise<{ resources: PatientResource[] }> {
  return fetchJson(`${API_BASE_V2}/resources`);
}

export async function getResourcesForStage(stageId: string): Promise<{ resources: PatientResource[] }> {
  return fetchJson(`${API_BASE_V2}/resources?stage_id=${encodeURIComponent(stageId)}`);
}

export async function searchAllResources(query: string): Promise<{ resources: PatientResource[] }> {
  return fetchJson(`${API_BASE_V2}/resources/search?q=${encodeURIComponent(query)}`);
}

// --- DPDPA: Nominee Designation ---

export interface NomineeData {
  name: string;
  relationship: string;
  email: string;
  phone: string;
}

export async function saveNominee(data: NomineeData): Promise<NomineeData> {
  return fetchJson(`${API_BASE_V2}/me/nominee`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getNominee(): Promise<NomineeData | null> {
  try {
    return await fetchJson(`${API_BASE_V2}/me/nominee`);
  } catch {
    return null;
  }
}

// --- DPDPA: Grievance Redressal ---

export async function submitGrievance(subject: string, description: string): Promise<{ id: string; status: string }> {
  return fetchJson(`${API_BASE_V2}/grievance`, {
    method: 'POST',
    body: JSON.stringify({ subject, description }),
  });
}

// --- Patient-Clinician Association ---

export async function associatePatient(
  hospitalId: string,
  accessCode?: string
): Promise<{ clinician_id?: string; clinician_name?: string; hospital_id?: string }> {
  return fetchJson(`${API_BASE_V2}/me/associate`, {
    method: 'POST',
    body: JSON.stringify({ hospital_id: hospitalId, access_code: accessCode }),
  });
}

// ================================
// Community Events API (v2)
// ================================

export interface GetEventsParams {
  when?: 'upcoming' | 'past';
  type?: 'wellness' | 'support' | 'education';
  limit?: number;
  offset?: number;
}

export async function getEvents(params: GetEventsParams = {}): Promise<PatientEventListResponse> {
  const { when = 'upcoming', limit = 50, offset = 0, type } = params;
  const query = new URLSearchParams({
    when,
    limit: String(limit),
    offset: String(offset),
  });
  if (type) query.set('type', type);
  return fetchJson(`${API_BASE_V2}/events?${query}`);
}

export async function getEvent(id: string): Promise<{ event: PatientEvent }> {
  return fetchJson(`${API_BASE_V2}/events/${encodeURIComponent(id)}`);
}

export async function rsvpEvent(id: string): Promise<PatientEventRsvpResponse> {
  return fetchJson(`${API_BASE_V2}/events/${encodeURIComponent(id)}/rsvp`, { method: 'POST' });
}

export async function cancelRsvp(id: string): Promise<PatientEventRsvpResponse> {
  return fetchJson(`${API_BASE_V2}/events/${encodeURIComponent(id)}/rsvp`, { method: 'DELETE' });
}

export { ApiError };

