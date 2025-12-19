import { useState } from 'react'
import { X, Send, Plus, X as RemoveIcon } from 'lucide-react'
import type { Category, CreatePostRequest, Post } from '../../types/forum'
import { createPost } from '../../services/forumApi'
import './CreatePostModal.css'

interface CreatePostModalProps {
  categories: Category[]
  defaultCategory?: string
  onClose: () => void
  onPostCreated: (post: Post) => void
}

export function CreatePostModal({
  categories,
  defaultCategory,
  onClose,
  onPostCreated,
}: CreatePostModalProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState(defaultCategory || categories[0]?.category_id || '')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/[^a-z0-9]/g, '')
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (title.length < 5 || title.length > 200) {
      setError('Title must be between 5 and 200 characters')
      return
    }
    if (content.length < 10 || content.length > 10000) {
      setError('Content must be between 10 and 10,000 characters')
      return
    }
    if (!categoryId) {
      setError('Please select a category')
      return
    }

    setIsSubmitting(true)
    try {
      const request: CreatePostRequest = {
        title: title.trim(),
        content: content.trim(),
        category_id: categoryId,
        tags,
        is_anonymous: isAnonymous,
      }
      const newPost = await createPost(request)
      onPostCreated(newPost)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post')
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedCategory = categories.find(c => c.category_id === categoryId)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="create-post-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create a Post</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="create-post-form">
          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Category</label>
            <div className="category-selector">
              {categories.map(cat => (
                <button
                  key={cat.category_id}
                  type="button"
                  className={`category-option ${categoryId === cat.category_id ? 'selected' : ''}`}
                  onClick={() => setCategoryId(cat.category_id)}
                  style={{ '--cat-color': cat.color } as React.CSSProperties}
                >
                  <span className="category-option-icon">{cat.icon}</span>
                  <span className="category-option-name">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              className="form-input"
              placeholder="Give your post a meaningful title..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={200}
            />
            <span className="char-count">{title.length}/200</span>
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              className="form-textarea"
              placeholder="Share your thoughts, experiences, or questions..."
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={8}
              maxLength={10000}
            />
            <span className="char-count">{content.length}/10,000</span>
          </div>

          <div className="form-group">
            <label>Tags (optional, max 5)</label>
            <div className="tags-input-container">
              <div className="tags-list">
                {tags.map(tag => (
                  <span key={tag} className="tag-chip">
                    #{tag}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveTag(tag)}
                      className="tag-remove"
                    >
                      <RemoveIcon size={12} />
                    </button>
                  </span>
                ))}
              </div>
              {tags.length < 5 && (
                <div className="tag-input-wrapper">
                  <input
                    type="text"
                    className="tag-input"
                    placeholder="Add a tag..."
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    maxLength={30}
                  />
                  <button 
                    type="button" 
                    className="tag-add-btn"
                    onClick={handleAddTag}
                    disabled={!tagInput.trim()}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-group anonymous-toggle">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={e => setIsAnonymous(e.target.checked)}
              />
              <span className="toggle-text">
                Post anonymously
                <small>Your username won't be visible to others</small>
              </span>
            </label>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting || !title.trim() || !content.trim()}
            >
              <Send size={16} />
              {isSubmitting ? 'Posting...' : 'Post'}
              {selectedCategory && (
                <span className="submit-category">
                  to {selectedCategory.icon} {selectedCategory.name}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

