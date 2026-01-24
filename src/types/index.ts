// API Types matching the backend models

export interface Source {
  title: string;
  url?: string;
  snippet?: string;
  source_text?: string;  // Full text from PDF for modal display
  relevance_score?: number;
  // Video-specific fields
  video_id?: string;
  video_url?: string;
  timestamped_url?: string;  // YouTube URL with timestamp
  video_title?: string;
  channel?: string;
  start_timestamp?: string;  // Human-readable timestamp (e.g., "5:23")
}

// v1 Chat types
export interface ChatRequestV1 {
  message: string;
  session_id?: string;
  context?: Record<string, unknown>;
  index_name?: string;
  strict_mode?: boolean;
  include_sources?: boolean;
}

export interface ChatResponseV1 {
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

// v2 Chat types
export interface ConversationTurn {
  role: 'user' | 'assistant';
  content: string;
}

export interface Citation {
  source_file: string;
  section?: string;
  page_start?: number;
  page_end?: number;
  relevance_score?: number;
  // Video-specific fields
  video_id?: string;
  video_url?: string;
  timestamped_url?: string;  // YouTube URL with timestamp
  video_title?: string;
  channel?: string;
  start_timestamp?: string;  // Human-readable timestamp (e.g., "5:23")
}

export interface SuggestedVideo {
  video_id: string;
  title: string;
  url: string;  // Full YouTube URL with timestamp if available
  channel_name: string | null;
  relevance_note: string | null;  // Brief excerpt from transcript
  timestamp_seconds: number | null;  // Start time in seconds
}

export interface ChatRequestV2 {
  message: string;
  session_id?: string;
  conversation_history?: ConversationTurn[] | Record<string, string>[];
  include_trace?: boolean;
}



export interface ChatResponseV2 {
  request_id: string;
  response: string;
  intent: string;
  stage: string;
  citations?: Citation[];
  confidence?: number;
  abstained?: boolean;
  disclaimer_included?: boolean;
  suggested_videos?: SuggestedVideo[];
  trace?: unknown[];
  total_latency_ms?: number;
  // Profile/onboarding fields
  needs_onboarding?: boolean;
  sign_in_suggestion?: string;

}

// Backwards-compatible aliases (v1 as default)
export type ChatRequest = ChatRequestV1;
export type ChatResponse = ChatResponseV1;

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Source[];
  suggested_videos?: SuggestedVideo[];
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

