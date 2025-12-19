import { MessageCircle, Pin, User } from 'lucide-react'
import type { PostPreview, Category } from '../../types/forum'
import { VoteButtons } from './VoteButtons'
import './PostCard.css'

interface PostCardProps {
  post: PostPreview
  category?: Category
  onClick: () => void
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

export function PostCard({ post, category, onClick }: PostCardProps) {
  return (
    <article className={`post-card ${post.is_pinned ? 'pinned' : ''}`}>
      <div className="post-card-votes">
        <VoteButtons
          targetType="post"
          targetId={post.post_id}
          voteCount={post.vote_count}
          userVote={null}
        />
      </div>
      
      <div className="post-card-content" onClick={onClick}>
        <div className="post-card-meta">
          {post.is_pinned && (
            <span className="post-pinned-badge">
              <Pin size={12} />
              Pinned
            </span>
          )}
          {category && (
            <span 
              className="post-category-badge"
              style={{ backgroundColor: category.color }}
            >
              {category.icon} {category.name}
            </span>
          )}
          <span className="post-author">
            <User size={12} />
            {post.is_anonymous ? 'Anonymous' : post.user_display_name}
          </span>
          <span className="post-time">{formatTimeAgo(post.created_at)}</span>
        </div>
        
        <h3 className="post-card-title">{post.title}</h3>
        
        <p className="post-card-preview">{post.content_preview}</p>
        
        <div className="post-card-footer">
          <div className="post-tags">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="post-tag">#{tag}</span>
            ))}
            {post.tags.length > 3 && (
              <span className="post-tag more">+{post.tags.length - 3}</span>
            )}
          </div>
          
          <div className="post-stats">
            <span className="post-comments">
              <MessageCircle size={14} />
              {post.comment_count}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}

