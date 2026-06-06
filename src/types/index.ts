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
  // URL for the source (e.g., link to leaflet/document)
  url?: string;
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
  session_id?: string;
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
  // Controls whether to show sources section in UI (false for citation-only mode)
  show_sources?: boolean;
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
  // Controls whether to show sources section (defaults to true if undefined)
  show_sources?: boolean;
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

// Community Events (patient portal)
export type PatientEventType = 'wellness' | 'support' | 'education';

export interface PatientEvent {
  id: string;
  hospital_id: string | null;
  title: string;
  starts_at: string;
  location: string | null;
  type: PatientEventType;
  is_virtual: boolean;
  description: string | null;
  status: 'published' | 'cancelled';
  attendee_count: number;
  user_has_rsvp: boolean;
  created_at: string;
  updated_at: string;
}

export interface PatientEventListResponse {
  events: PatientEvent[];
  total_count: number;
}

export interface PatientEventRsvpResponse {
  message: string;
  event: PatientEvent;
}

// Clinical Team (patient read-only)
export interface ClinicalTeamMember {
  id: string;
  clinician_id?: string;
  name: string;
  role: string;
  specialty: string | null;
  avatar_url: string | null;
  contact_email: string | null;
  contact_phone?: string | null;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ClinicalTeamResponse {
  team_members: ClinicalTeamMember[];
  total_count: number;
  clinician_id: string | null;
}

