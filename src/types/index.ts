// API Types matching the backend models

export interface Source {
  title: string;
  url?: string;
  snippet?: string;
  relevance_score?: number;
}

export interface ChatRequest {
  message: string;
  session_id?: string;
  context?: Record<string, unknown>;
}

export interface ChatResponse {
  session_id: string;
  answer: string;
  sources: Source[];
  disclaimer: string;
  suggested_questions: string[];
  timestamp: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Source[];
  suggested_questions?: string[];
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
  session_id: string;
  message_id: string;
  rating: number;
  feedback?: string;
}

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  environment: string;
  services: Record<string, string>;
}

