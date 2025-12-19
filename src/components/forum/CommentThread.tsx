import { useState } from 'react'
import { Reply, Flag, Trash2, User, Send } from 'lucide-react'
import type { Comment } from '../../types/forum'
import { VoteButtons } from './VoteButtons'
import { createComment, deleteComment } from '../../services/forumApi'
import './CommentThread.css'

interface CommentThreadProps {
  comments: Comment[]
  postId: string
  currentUserId?: string
  onCommentAdded: (comment: Comment, parentId: string | null) => void
  onCommentDeleted: (commentId: string) => void
  onReport: (commentId: string) => void
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

interface SingleCommentProps {
  comment: Comment
  postId: string
  currentUserId?: string
  onCommentAdded: (comment: Comment, parentId: string | null) => void
  onCommentDeleted: (commentId: string) => void
  onReport: (commentId: string) => void
}

function SingleComment({
  comment,
  postId,
  currentUserId,
  onCommentAdded,
  onCommentDeleted,
  onReport,
}: SingleCommentProps) {
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAnonymous, setIsAnonymous] = useState(false)

  const handleSubmitReply = async () => {
    if (!replyContent.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const newComment = await createComment(postId, {
        content: replyContent.trim(),
        parent_comment_id: comment.comment_id,
        is_anonymous: isAnonymous,
      })
      onCommentAdded(newComment, comment.comment_id)
      setReplyContent('')
      setShowReplyInput(false)
      setIsAnonymous(false)
    } catch (error) {
      console.error('Failed to post reply:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) return
    
    try {
      await deleteComment(comment.comment_id)
      onCommentDeleted(comment.comment_id)
    } catch (error) {
      console.error('Failed to delete comment:', error)
    }
  }

  // Check if current user owns this comment
  const isOwner = currentUserId && comment.user_display_name.includes(currentUserId)

  return (
    <div 
      className="comment" 
      style={{ marginLeft: comment.depth > 0 ? `${Math.min(comment.depth * 24, 96)}px` : 0 }}
    >
      <div className="comment-main">
        <VoteButtons
          targetType="comment"
          targetId={comment.comment_id}
          voteCount={comment.vote_count}
          userVote={comment.user_vote}
          size="small"
        />
        
        <div className="comment-content">
          <div className="comment-header">
            <span className="comment-author">
              <User size={12} />
              {comment.is_anonymous ? 'Anonymous' : comment.user_display_name}
            </span>
            <span className="comment-time">{formatTimeAgo(comment.created_at)}</span>
          </div>
          
          <p className="comment-text">{comment.content}</p>
          
          <div className="comment-actions">
            <button 
              className="comment-action-btn"
              onClick={() => setShowReplyInput(!showReplyInput)}
            >
              <Reply size={14} />
              Reply
            </button>
            
            {isOwner && (
              <button 
                className="comment-action-btn danger"
                onClick={handleDelete}
              >
                <Trash2 size={14} />
                Delete
              </button>
            )}
            
            <button 
              className="comment-action-btn"
              onClick={() => onReport(comment.comment_id)}
            >
              <Flag size={14} />
              Report
            </button>
          </div>
          
          {showReplyInput && (
            <div className="reply-input-container">
              <textarea
                className="reply-input"
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={2}
              />
              <div className="reply-input-footer">
                <label className="anonymous-checkbox">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                  />
                  Post anonymously
                </label>
                <div className="reply-buttons">
                  <button 
                    className="reply-cancel-btn"
                    onClick={() => {
                      setShowReplyInput(false)
                      setReplyContent('')
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="reply-submit-btn"
                    onClick={handleSubmitReply}
                    disabled={!replyContent.trim() || isSubmitting}
                  >
                    <Send size={14} />
                    {isSubmitting ? 'Posting...' : 'Reply'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="comment-replies">
          {comment.replies.map((reply) => (
            <SingleComment
              key={reply.comment_id}
              comment={reply}
              postId={postId}
              currentUserId={currentUserId}
              onCommentAdded={onCommentAdded}
              onCommentDeleted={onCommentDeleted}
              onReport={onReport}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function CommentThread({
  comments,
  postId,
  currentUserId,
  onCommentAdded,
  onCommentDeleted,
  onReport,
}: CommentThreadProps) {
  if (comments.length === 0) {
    return (
      <div className="comments-empty">
        <p>No comments yet. Be the first to share your thoughts! 💬</p>
      </div>
    )
  }

  return (
    <div className="comment-thread">
      {comments.map((comment) => (
        <SingleComment
          key={comment.comment_id}
          comment={comment}
          postId={postId}
          currentUserId={currentUserId}
          onCommentAdded={onCommentAdded}
          onCommentDeleted={onCommentDeleted}
          onReport={onReport}
        />
      ))}
    </div>
  )
}

