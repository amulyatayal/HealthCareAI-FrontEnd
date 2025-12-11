import { useState, useEffect } from 'react'
import { 
  Heart, 
  Pill, 
  Activity, 
  Smile, 
  Leaf, 
  Sun, 
  HelpCircle,
  ChevronRight,
  Search,
  Loader2
} from 'lucide-react'
import { getTopics } from '../services/api'
import type { Topic } from '../types'
import './TopicsBrowser.css'

const topicIcons: Record<string, typeof Heart> = {
  understanding: Heart,
  treatment: Pill,
  side_effects: Activity,
  emotional: Smile,
  lifestyle: Leaf,
  survivorship: Sun,
  resources: HelpCircle,
}

const topicColors: Record<string, string> = {
  understanding: 'rose',
  treatment: 'purple',
  side_effects: 'amber',
  emotional: 'sage',
  lifestyle: 'teal',
  survivorship: 'gold',
  resources: 'lavender',
}

interface TopicsBrowserProps {
  onSelectTopic?: (topic: string, subtopic?: string) => void
}

export function TopicsBrowser({ onSelectTopic }: TopicsBrowserProps) {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null)

  useEffect(() => {
    async function loadTopics() {
      try {
        const response = await getTopics()
        setTopics(response.topics)
      } catch (error) {
        console.error('Failed to load topics:', error)
        // Fallback to default topics
        setTopics([
          { id: 'understanding', name: 'Understanding Breast Cancer', subtopics: ['Types', 'Stages', 'Risk factors'] },
          { id: 'treatment', name: 'Treatment Options', subtopics: ['Surgery', 'Chemotherapy', 'Radiation'] },
          { id: 'side_effects', name: 'Managing Side Effects', subtopics: ['Fatigue', 'Nausea', 'Pain'] },
          { id: 'emotional', name: 'Emotional Support', subtopics: ['Coping', 'Anxiety', 'Support groups'] },
          { id: 'lifestyle', name: 'Lifestyle & Wellness', subtopics: ['Nutrition', 'Exercise', 'Sleep'] },
          { id: 'survivorship', name: 'Survivorship', subtopics: ['Follow-up care', 'Long-term health'] },
          { id: 'resources', name: 'Resources & Support', subtopics: ['Financial help', 'Organizations'] },
        ])
      } finally {
        setLoading(false)
      }
    }
    loadTopics()
  }, [])

  const filteredTopics = topics.filter(topic => {
    const query = searchQuery.toLowerCase()
    return (
      topic.name.toLowerCase().includes(query) ||
      topic.subtopics.some(st => st.toLowerCase().includes(query))
    )
  })

  const handleTopicClick = (topic: Topic) => {
    if (expandedTopic === topic.id) {
      setExpandedTopic(null)
    } else {
      setExpandedTopic(topic.id)
    }
  }

  const handleSubtopicClick = (topic: Topic, subtopic: string) => {
    onSelectTopic?.(topic.name, subtopic)
  }

  if (loading) {
    return (
      <div className="topics-loading">
        <Loader2 size={32} className="spin" />
        <p>Loading topics...</p>
      </div>
    )
  }

  return (
    <div className="topics-browser">
      <div className="topics-header">
        <h2 className="topics-title">Knowledge Topics</h2>
        <p className="topics-description">
          Explore our curated collection of breast cancer information and resources
        </p>
        
        <div className="topics-search">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="topics-grid">
        {filteredTopics.map((topic) => {
          const Icon = topicIcons[topic.id] || HelpCircle
          const color = topicColors[topic.id] || 'rose'
          const isExpanded = expandedTopic === topic.id

          return (
            <div 
              key={topic.id} 
              className={`topic-card topic-${color} ${isExpanded ? 'expanded' : ''}`}
            >
              <button 
                className="topic-header"
                onClick={() => handleTopicClick(topic)}
              >
                <div className="topic-icon">
                  <Icon size={24} />
                </div>
                <div className="topic-info">
                  <h3 className="topic-name">{topic.name}</h3>
                  <span className="topic-count">
                    {topic.subtopics.length} subtopics
                  </span>
                </div>
                <ChevronRight 
                  size={20} 
                  className={`topic-chevron ${isExpanded ? 'rotated' : ''}`} 
                />
              </button>

              {isExpanded && (
                <div className="topic-subtopics">
                  {topic.subtopics.map((subtopic) => (
                    <button
                      key={subtopic}
                      className="subtopic-btn"
                      onClick={() => handleSubtopicClick(topic, subtopic)}
                    >
                      {subtopic}
                      <ChevronRight size={14} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filteredTopics.length === 0 && (
        <div className="topics-empty">
          <p>No topics found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  )
}

