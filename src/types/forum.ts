// Forum Types

export interface Category {
  category_id: string
  name: string
  description: string
  icon: string
  color: string
  post_count: number
}

export interface PostPreview {
  post_id: string
  category_id: string
  title: string
  content_preview: string
  user_display_name: string
  is_anonymous: boolean
  vote_count: number
  comment_count: number
  created_at: string
  tags: string[]
  is_pinned: boolean
}

export interface Post {
  post_id: string
  category_id: string
  title: string
  content: string
  user_display_name: string
  is_anonymous: boolean
  vote_count: number
  comment_count: number
  created_at: string
  tags: string[]
  is_pinned: boolean
  user_vote: 1 | -1 | null
}

export interface Comment {
  comment_id: string
  content: string
  user_display_name: string
  is_anonymous: boolean
  vote_count: number
  depth: number
  created_at: string
  user_vote: 1 | -1 | null
  replies: Comment[]
}

export interface PostsResponse {
  posts: PostPreview[]
  total_count: number
  page: number
  page_size: number
  has_more: boolean
}

export interface PostDetailResponse {
  post: Post
  comments: Comment[]
}

export interface CreatePostRequest {
  title: string
  content: string
  category_id: string
  tags: string[]
  is_anonymous: boolean
}

export interface CreateCommentRequest {
  content: string
  parent_comment_id: string | null
  is_anonymous: boolean
}

export interface VoteRequest {
  target_type: 'post' | 'comment'
  target_id: string
  vote: 1 | -1 | 0
}

export interface VoteResponse {
  success: boolean
  new_vote_count: number
  user_vote: 1 | -1 | null
}

export interface ReportRequest {
  target_type: 'post' | 'comment'
  target_id: string
  reason: string
}

export type SortOption = 'new' | 'top' | 'hot'

