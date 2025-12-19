import { useState, useEffect, useCallback } from 'react'
import { Plus, SortAsc, RefreshCw, Heart } from 'lucide-react'
import type { Category, PostPreview, SortOption, Post } from '../../types/forum'
import { getCategories, getPosts } from '../../services/forumApi'
import { CategoryTabs } from './CategoryTabs'
import { PostCard } from './PostCard'
import { PostDetail } from './PostDetail'
import { CreatePostModal } from './CreatePostModal'
import './ForumHome.css'

interface ForumHomeProps {
  currentUserId?: string
}

export function ForumHome({ currentUserId }: ForumHomeProps) {
  // Data state
  const [categories, setCategories] = useState<Category[]>([])
  const [posts, setPosts] = useState<PostPreview[]>([])
  
  // UI state
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState<SortOption>('new')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  
  // Loading states
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [postsLoading, setPostsLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  
  // View state
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories()
  }, [])

  // Fetch posts when filters change
  useEffect(() => {
    setPage(1)
    setPosts([])
    fetchPosts(1, true)
  }, [selectedCategory, sortBy])

  const fetchCategories = async () => {
    setCategoriesLoading(true)
    try {
      const cats = await getCategories()
      setCategories(cats)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setCategoriesLoading(false)
    }
  }

  const fetchPosts = async (pageNum: number, replace: boolean = false) => {
    if (replace) {
      setPostsLoading(true)
    } else {
      setLoadingMore(true)
    }

    try {
      const response = await getPosts(
        selectedCategory === 'all' ? undefined : selectedCategory,
        pageNum,
        20,
        sortBy
      )
      
      if (replace) {
        setPosts(response.posts)
      } else {
        setPosts(prev => [...prev, ...response.posts])
      }
      setHasMore(response.has_more)
      setPage(pageNum)
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setPostsLoading(false)
      setLoadingMore(false)
    }
  }

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchPosts(page + 1, false)
    }
  }, [loadingMore, hasMore, page])

  const handlePostCreated = (newPost: Post) => {
    // Add to beginning of list
    const preview: PostPreview = {
      post_id: newPost.post_id,
      category_id: newPost.category_id,
      title: newPost.title,
      content_preview: newPost.content.substring(0, 200),
      user_display_name: newPost.user_display_name,
      is_anonymous: newPost.is_anonymous,
      vote_count: 0,
      comment_count: 0,
      created_at: newPost.created_at,
      tags: newPost.tags,
      is_pinned: false,
    }
    setPosts(prev => [preview, ...prev])
  }

  const handlePostDeleted = () => {
    if (selectedPostId) {
      setPosts(prev => prev.filter(p => p.post_id !== selectedPostId))
      setSelectedPostId(null)
    }
  }

  const getCategoryForPost = (categoryId: string) => {
    return categories.find(c => c.category_id === categoryId)
  }

  // Show post detail view
  if (selectedPostId) {
    return (
      <PostDetail
        postId={selectedPostId}
        categories={categories}
        currentUserId={currentUserId}
        onBack={() => setSelectedPostId(null)}
        onPostDeleted={handlePostDeleted}
      />
    )
  }

  return (
    <div className="forum-home">
      {/* Header */}
      <div className="forum-header">
        <div className="forum-title">
          <Heart className="forum-icon" size={28} />
          <div>
            <h1>Community Forum</h1>
            <p>Share, support, and connect with others on their journey</p>
          </div>
        </div>
        <button className="create-post-btn" onClick={() => setShowCreateModal(true)}>
          <Plus size={20} />
          Create Post
        </button>
      </div>

      {/* Category Tabs */}
      <CategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        loading={categoriesLoading}
      />

      {/* Sort Controls */}
      <div className="forum-controls">
        <div className="sort-dropdown">
          <SortAsc size={16} />
          <select value={sortBy} onChange={e => setSortBy(e.target.value as SortOption)}>
            <option value="new">Newest</option>
            <option value="top">Top Voted</option>
            <option value="hot">Hot</option>
          </select>
        </div>
        <button 
          className="refresh-btn" 
          onClick={() => fetchPosts(1, true)}
          disabled={postsLoading}
        >
          <RefreshCw size={16} className={postsLoading ? 'spinning' : ''} />
        </button>
      </div>

      {/* Posts List */}
      <div className="posts-list">
        {postsLoading && posts.length === 0 ? (
          <div className="posts-loading">
            {[1, 2, 3].map(i => (
              <div key={i} className="post-skeleton">
                <div className="skeleton-votes" />
                <div className="skeleton-content">
                  <div className="skeleton-meta" />
                  <div className="skeleton-title" />
                  <div className="skeleton-preview" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="posts-empty">
            <div className="empty-icon">💬</div>
            <h3>No posts yet</h3>
            <p>Be the first to share your thoughts or ask a question!</p>
            <button onClick={() => setShowCreateModal(true)}>
              <Plus size={16} />
              Create the first post
            </button>
          </div>
        ) : (
          <>
            {posts.map(post => (
              <PostCard
                key={post.post_id}
                post={post}
                category={getCategoryForPost(post.category_id)}
                onClick={() => setSelectedPostId(post.post_id)}
              />
            ))}
            
            {hasMore && (
              <button 
                className="load-more-btn"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <>
                    <RefreshCw size={16} className="spinning" />
                    Loading...
                  </>
                ) : (
                  'Load more posts'
                )}
              </button>
            )}
          </>
        )}
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <CreatePostModal
          categories={categories}
          defaultCategory={selectedCategory !== 'all' ? selectedCategory : undefined}
          onClose={() => setShowCreateModal(false)}
          onPostCreated={handlePostCreated}
        />
      )}
    </div>
  )
}

