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
  IndexesResponse
} from '../types';

const API_BASE_V1 = '/api/v1';
const API_BASE_V2 = '/api/v2';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
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

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const userId = getUserId();

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      // For Google auth, send the JWT token
      // For guest auth, send a custom header with user ID
      ...(token && !token.startsWith('guest:') && { 'Authorization': `Bearer ${token}` }),
      ...(userId && { 'X-User-ID': userId }),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    // If unauthorized, signal session expiration
    if (response.status === 401) {
      // Clear the bad token immediately to prevent infinite 401 loops
      localStorage.removeItem('auth_token');

      // Dispatch event for modal (if listener exists in App.tsx)
      window.dispatchEvent(new CustomEvent('auth:session-expired'));

      // Force reload to reset app state and redirect to login
      // Skip reload if already on login page to prevent reload loop
      if (!window.location.pathname.includes('/login')) {
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    }
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new ApiError(response.status, error.detail || error.message || 'An error occurred');
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

export { ApiError };

