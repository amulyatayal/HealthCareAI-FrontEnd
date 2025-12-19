import { useState, useEffect } from 'react'
import { ArrowLeft, Flag, Trash2, User, MessageCircle, Send } from 'lucide-react'
import type { Post, Comment, Category } from '../../types/forum'
import { getPost, createComment, deletePost } from '../../services/forumApi'
import { VoteButtons } from './VoteButtons'
import { CommentThread } from './CommentThread'
import { ReportModal } from './ReportModal'
import './PostDetail.css'

interface PostDetailProps {
  postId: string
  categories: Category[]
  currentUserId?: string
  onBack: () => void
  onPostDeleted: () => void
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function PostDetail({
  postId,
  categories,
  currentUserId,
  onBack,
  onPostDeleted,
}: PostDetailProps) {
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAllComments, setShowAllComments] = useState(false)
  const COMMENTS_LIMIT = 10

  // New comment state
  const [newComment, setNewComment] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Report modal
  const [reportTarget, setReportTarget] = useState<{
    type: 'post' | 'comment'
    id: string
  } | null>(null)

  useEffect(() => {
    fetchPost()
  }, [postId])

  const fetchPost = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getPost(postId)
      setPost(response.post)
      setComments(response.comments)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load post')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async () => {
    if (!newComment.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const comment = await createComment(postId, {
        content: newComment.trim(),
        parent_comment_id: null,
        is_anonymous: isAnonymous,
      })
      setComments([...comments, comment])
      setNewComment('')
      setIsAnonymous(false)
    } catch (err) {
      console.error('Failed to post comment:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCommentAdded = (newComment: Comment, parentId: string | null) => {
    if (!parentId) {
      setComments([...comments, newComment])
    } else {
      // Add to nested replies
      const addReply = (commentList: Comment[]): Comment[] => {
        return commentList.map(c => {
          if (c.comment_id === parentId) {
            return { ...c, replies: [...(c.replies || []), newComment] }
          }
          if (c.replies && c.replies.length > 0) {
            return { ...c, replies: addReply(c.replies) }
          }
          return c
        })
      }
      setComments(addReply(comments))
    }
  }

  const handleCommentDeleted = (commentId: string) => {
    const removeComment = (commentList: Comment[]): Comment[] => {
      return commentList
        .filter(c => c.comment_id !== commentId)
        .map(c => ({
          ...c,
          replies: c.replies ? removeComment(c.replies) : [],
        }))
    }
    setComments(removeComment(comments))
  }

  const handleDeletePost = async () => {
    if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) return
    
    try {
      await deletePost(postId)
      onPostDeleted()
    } catch (err) {
      console.error('Failed to delete post:', err)
    }
  }

  if (loading) {
    return (
      <div className="post-detail-loading">
        <div className="loading-spinner" />
        <p>Loading post...</p>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="post-detail-error">
        <p>{error || 'Post not found'}</p>
        <button onClick={onBack}>Go Back</button>
      </div>
    )
  }

  const category = categories.find(c => c.category_id === post.category_id)
  const isOwner = currentUserId && post.user_display_name.includes(currentUserId)

  return (
    <div className="post-detail">
      {/* Compact Header Row */}
      <div className="post-detail-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={18} />
          Back
        </button>
        
        <div className="header-actions">
          {isOwner && (
            <button className="action-btn danger" onClick={handleDeletePost}>
              <Trash2 size={14} />
            </button>
          )}
          <button 
            className="action-btn"
            onClick={() => setReportTarget({ type: 'post', id: post.post_id })}
          >
            <Flag size={14} />
          </button>
        </div>
      </div>

      {/* Post Content - Compact */}
      <article className="post-detail-content">
        <div className="post-vote-column">
          <VoteButtons
            targetType="post"
            targetId={post.post_id}
            voteCount={post.vote_count}
            userVote={post.user_vote}
          />
        </div>

        <div className="post-main">
          <div className="post-meta">
            {category && (
              <span 
                className="post-category"
                style={{ backgroundColor: category.color }}
              >
                {category.icon} {category.name}
              </span>
            )}
            <span className="post-author">
              <User size={12} />
              {post.is_anonymous ? 'Anonymous' : post.user_display_name}
            </span>
            <span className="post-time-compact">{formatDate(post.created_at)}</span>
          </div>

          <h2 className="post-title-compact">{post.title}</h2>

          <div className="post-body-compact">
            {post.content.split('\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="post-tags-compact">
              {post.tags.map(tag => (
                <span key={tag} className="post-tag">#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </article>

      {/* Comments Section */}
      <section className="comments-section">
        <h2 className="comments-title">
          <MessageCircle size={20} />
          Comments ({post.comment_count})
        </h2>

        {/* Comments List - Reversed order (newest first), limited to 10 */}
        <div className="comments-scroll-container">
          {(() => {
            const reversedComments = [...comments].reverse()
            const displayedComments = showAllComments 
              ? reversedComments 
              : reversedComments.slice(0, COMMENTS_LIMIT)
            const hasMoreComments = comments.length > COMMENTS_LIMIT && !showAllComments

            return (
              <>
                <CommentThread
                  comments={displayedComments}
                  postId={postId}
                  currentUserId={currentUserId}
                  onCommentAdded={handleCommentAdded}
                  onCommentDeleted={handleCommentDeleted}
                  onReport={(commentId) => setReportTarget({ type: 'comment', id: commentId })}
                />

                {hasMoreComments && (
                  <button 
                    className="load-more-comments-btn"
                    onClick={() => setShowAllComments(true)}
                  >
                    Show {comments.length - COMMENTS_LIMIT} more comments
                  </button>
                )}
              </>
            )
          })()}
        </div>

        {/* New Comment Form - Compact inline */}
        <div className="new-comment-form-inline">
          <div className="comment-input-wrapper">
            <textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              rows={2}
            />
            <button
              className="submit-comment-btn-inline"
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || isSubmitting}
              title="Post comment"
            >
              <Send size={18} />
            </button>
          </div>
          <label className="anonymous-toggle-small">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={e => setIsAnonymous(e.target.checked)}
            />
            <span>Post anonymously</span>
          </label>
        </div>
      </section>

      {/* Report Modal */}
      {reportTarget && (
        <ReportModal
          targetType={reportTarget.type}
          targetId={reportTarget.id}
          onClose={() => setReportTarget(null)}
          onReported={() => setReportTarget(null)}
        />
      )}
    </div>
  )
}

