import type {
  ChatRequest,
  ChatResponse,
  KnowledgeSearchRequest,
  KnowledgeSearchResponse,
  TopicsResponse,
  KnowledgeDocument,
  ChatHistory,
  FeedbackRequest,
  HealthStatus,
  IndexesResponse
} from '../types';

const API_BASE = '/api/v1';

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
    // If unauthorized, clear token and reload to show login
    if (response.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.reload();
    }
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new ApiError(response.status, error.detail || error.message || 'An error occurred');
  }

  return response.json();
}

// Chat API
export async function sendMessage(request: ChatRequest): Promise<ChatResponse> {
  return fetchJson<ChatResponse>(`${API_BASE}/chat`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export async function getChatHistory(sessionId: string): Promise<ChatHistory> {
  return fetchJson<ChatHistory>(`${API_BASE}/chat/history/${sessionId}`);
}

export async function clearChatHistory(sessionId: string): Promise<{ message: string }> {
  return fetchJson<{ message: string }>(`${API_BASE}/chat/history/${sessionId}`, {
    method: 'DELETE',
  });
}

export async function submitFeedback(request: FeedbackRequest): Promise<{ message: string }> {
  return fetchJson<{ message: string }>(`${API_BASE}/chat/feedback`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

// Knowledge API
export async function searchKnowledge(request: KnowledgeSearchRequest): Promise<KnowledgeSearchResponse> {
  return fetchJson<KnowledgeSearchResponse>(`${API_BASE}/knowledge/search`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export async function getTopics(): Promise<TopicsResponse> {
  return fetchJson<TopicsResponse>(`${API_BASE}/knowledge/topics`);
}

export async function getDocument(documentId: string): Promise<KnowledgeDocument> {
  return fetchJson<KnowledgeDocument>(`${API_BASE}/knowledge/document/${documentId}`);
}

// Health API
export async function getHealthStatus(): Promise<HealthStatus> {
  return fetchJson<HealthStatus>('/health');
}

// Indexes API
export async function getAvailableIndexes(): Promise<IndexesResponse> {
  return fetchJson<IndexesResponse>(`${API_BASE}/knowledge/indexes`);
}

export { ApiError };

