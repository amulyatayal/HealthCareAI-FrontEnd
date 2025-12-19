import type { Category } from '../../types/forum'
import './CategoryTabs.css'

interface CategoryTabsProps {
  categories: Category[]
  selectedCategory: string
  onSelectCategory: (categoryId: string) => void
  loading?: boolean
}

export function CategoryTabs({
  categories,
  selectedCategory,
  onSelectCategory,
  loading = false,
}: CategoryTabsProps) {
  if (loading) {
    return (
      <div className="category-tabs loading">
        <div className="category-tab-skeleton" />
        <div className="category-tab-skeleton" />
        <div className="category-tab-skeleton" />
      </div>
    )
  }

  return (
    <div className="category-tabs">
      <button
        className={`category-tab ${selectedCategory === 'all' ? 'active' : ''}`}
        onClick={() => onSelectCategory('all')}
      >
        <span className="category-icon">🏠</span>
        <span className="category-name">All Posts</span>
      </button>
      
      {categories.map((category) => (
        <button
          key={category.category_id}
          className={`category-tab ${selectedCategory === category.category_id ? 'active' : ''}`}
          onClick={() => onSelectCategory(category.category_id)}
          style={{ '--category-color': category.color } as React.CSSProperties}
        >
          <span className="category-icon">{category.icon}</span>
          <span className="category-name">{category.name}</span>
          {category.post_count > 0 && (
            <span className="category-count">{category.post_count}</span>
          )}
        </button>
      ))}
    </div>
  )
}

