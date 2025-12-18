// API Types matching the backend models

export interface Source {
  title: string;
  url?: string;
  snippet?: string;
  source_text?: string;  // Full text from PDF for modal display
  relevance_score?: number;
}

export interface ChatRequest {
  message: string;
  session_id?: string;
  context?: Record<string, unknown>;
  index_name?: string;
  strict_mode?: boolean;
  include_sources?: boolean;
}

export interface ChatResponse {
  session_id: string;
  answer: string;
  sources: Source[];
  disclaimer: string;
  suggested_questions: string[];
  timestamp: string;
  has_sufficient_evidence?: boolean;
  support_helpline?: string;
  support_helpline_name?: string;
  conversation_id?: string;
  conversation_created_at?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Source[];
  disclaimer?: string;
  has_sufficient_evidence?: boolean;
  support_helpline?: string;
  support_helpline_name?: string;
  conversation_id?: string;
  conversation_created_at?: string;
  feedbackGiven?: 'thumbs_up' | 'thumbs_down' | null;
}

export interface KnowledgeSearchRequest {
  query: string;
  k?: number;
  filters?: Record<string, unknown>;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  content: string;
  topic?: string;
  subtopic?: string;
  source?: string;
  last_updated?: string;
  relevance_score?: number;
}

export interface KnowledgeSearchResponse {
  query: string;
  results: KnowledgeDocument[];
  total_results: number;
  search_time_ms?: number;
}

export interface Topic {
  id: string;
  name: string;
  subtopics: string[];
}

export interface TopicsResponse {
  topics: Topic[];
}

export interface ChatHistory {
  session_id: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  message_count: number;
}

export interface FeedbackRequest {
  conversation_id: string;
  created_at: string;
  rating: 'thumbs_up' | 'thumbs_down';
  feedback_text?: string;
}

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  environment: string;
  services: Record<string, string>;
}

export interface IndexInfo {
  index_name: string;
  display_name: string;
  description?: string;
  document_count: number;
}

export interface IndexesResponse {
  indexes: IndexInfo[];
}

