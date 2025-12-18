import { Database, ChevronDown, Loader2 } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import type { IndexInfo } from '../types'
import './IndexSelector.css'

interface IndexSelectorProps {
  selectedIndex: string
  onSelectIndex: (index: string) => void
  availableIndexes: IndexInfo[]
  isLoading?: boolean
}

export function IndexSelector({ 
  selectedIndex, 
  onSelectIndex, 
  availableIndexes,
  isLoading 
}: IndexSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (index: string) => {
    onSelectIndex(index)
    setIsOpen(false)
  }

  // Get display name for the selected index
  const getDisplayName = (indexName: string) => {
    const index = availableIndexes.find(i => i.index_name === indexName)
    if (index?.display_name) return index.display_name
    // Fallback: convert snake_case to Title Case
    return indexName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  if (isLoading) {
    return (
      <div className="index-selector loading">
        <Loader2 size={16} className="spin" />
        <span>Loading...</span>
      </div>
    )
  }

  if (availableIndexes.length === 0) {
    return null
  }

  return (
    <div className="index-selector" ref={dropdownRef}>
      <button 
        className="index-selector-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Database size={16} />
        <span className="index-selector-label">Knowledge Base:</span>
        <span className="index-selector-value">{getDisplayName(selectedIndex)}</span>
        <ChevronDown size={16} className={`index-selector-chevron ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <div className="index-selector-dropdown" role="listbox">
          {availableIndexes.map((index) => (
            <button
              key={index.index_name}
              className={`index-selector-option ${index.index_name === selectedIndex ? 'selected' : ''}`}
              onClick={() => handleSelect(index.index_name)}
              role="option"
              aria-selected={index.index_name === selectedIndex}
            >
              <Database size={14} />
              <div className="index-option-content">
                <span className="index-option-name">
                  {index.display_name} ({index.document_count} docs)
                </span>
                {index.description && (
                  <span className="index-option-description">{index.description}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
