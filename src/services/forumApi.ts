import type {
  Category,
  PostsResponse,
  PostDetailResponse,
  CreatePostRequest,
  CreateCommentRequest,
  VoteRequest,
  VoteResponse,
  ReportRequest,
  SortOption,
  Post,
  Comment,
} from '../types/forum'

const API_BASE = '/api/v1/forum'

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

// Get auth headers from localStorage
function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('auth_token')
  
  if (!token) {
    return {}
  }
  
  // Guest token
  if (token.startsWith('guest:')) {
    try {
      const data = JSON.parse(atob(token.substring(6)))
      return { 'X-User-ID': data.id }
    } catch {
      return {}
    }
  }
  
  // Google OAuth token
  return { 'Authorization': `Bearer ${token}` }
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options?.headers,
    },
  })

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.reload()
    }
    const error = await response.json().catch(() => ({ message: 'An error occurred' }))
    throw new ApiError(response.status, error.detail || error.message || 'An error occurred')
  }

  return response.json()
}

// Categories
export async function getCategories(): Promise<Category[]> {
  return fetchJson<Category[]>(`${API_BASE}/categories`)
}

// Posts
export async function getPosts(
  category?: string,
  page: number = 1,
  pageSize: number = 20,
  sort: SortOption = 'new'
): Promise<PostsResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
    sort,
  })
  if (category && category !== 'all') {
    params.set('category', category)
  }
  return fetchJson<PostsResponse>(`${API_BASE}/posts?${params}`)
}

export async function getPost(postId: string): Promise<PostDetailResponse> {
  return fetchJson<PostDetailResponse>(`${API_BASE}/posts/${postId}`)
}

export async function createPost(request: CreatePostRequest): Promise<Post> {
  return fetchJson<Post>(`${API_BASE}/posts`, {
    method: 'POST',
    body: JSON.stringify(request),
  })
}

export async function deletePost(postId: string): Promise<{ message: string }> {
  return fetchJson<{ message: string }>(`${API_BASE}/posts/${postId}`, {
    method: 'DELETE',
  })
}

// Comments
export async function createComment(
  postId: string,
  request: CreateCommentRequest
): Promise<Comment> {
  return fetchJson<Comment>(`${API_BASE}/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify(request),
  })
}

export async function deleteComment(commentId: string): Promise<{ message: string }> {
  return fetchJson<{ message: string }>(`${API_BASE}/comments/${commentId}`, {
    method: 'DELETE',
  })
}

// Voting
export async function vote(request: VoteRequest): Promise<VoteResponse> {
  return fetchJson<VoteResponse>(`${API_BASE}/vote`, {
    method: 'POST',
    body: JSON.stringify(request),
  })
}

// Reporting
export async function reportContent(request: ReportRequest): Promise<{ message: string }> {
  return fetchJson<{ message: string }>(`${API_BASE}/report`, {
    method: 'POST',
    body: JSON.stringify(request),
  })
}

export { ApiError }

