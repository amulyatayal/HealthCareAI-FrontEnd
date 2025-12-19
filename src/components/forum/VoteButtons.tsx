import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { vote } from '../../services/forumApi'
import './VoteButtons.css'

interface VoteButtonsProps {
  targetType: 'post' | 'comment'
  targetId: string
  voteCount: number
  userVote: 1 | -1 | null
  onVoteChange?: (newCount: number, newVote: 1 | -1 | null) => void
  size?: 'small' | 'medium'
  horizontal?: boolean
}

export function VoteButtons({
  targetType,
  targetId,
  voteCount,
  userVote,
  onVoteChange,
  size = 'medium',
  horizontal = false,
}: VoteButtonsProps) {
  const [currentVote, setCurrentVote] = useState<1 | -1 | null>(userVote)
  const [currentCount, setCurrentCount] = useState(voteCount)
  const [isVoting, setIsVoting] = useState(false)

  const handleVote = async (voteValue: 1 | -1) => {
    if (isVoting) return

    // If clicking the same vote, remove it (toggle)
    const newVote = currentVote === voteValue ? 0 : voteValue

    setIsVoting(true)
    try {
      const response = await vote({
        target_type: targetType,
        target_id: targetId,
        vote: newVote,
      })

      setCurrentCount(response.new_vote_count)
      setCurrentVote(response.user_vote)
      onVoteChange?.(response.new_vote_count, response.user_vote)
    } catch (error) {
      console.error('Failed to vote:', error)
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <div className={`vote-buttons ${horizontal ? 'horizontal' : 'vertical'} ${size}`}>
      <button
        className={`vote-btn upvote ${currentVote === 1 ? 'active' : ''}`}
        onClick={() => handleVote(1)}
        disabled={isVoting}
        aria-label="Upvote"
      >
        <ChevronUp size={size === 'small' ? 16 : 20} />
      </button>
      
      <span className={`vote-count ${currentCount > 0 ? 'positive' : currentCount < 0 ? 'negative' : ''}`}>
        {currentCount}
      </span>
      
      <button
        className={`vote-btn downvote ${currentVote === -1 ? 'active' : ''}`}
        onClick={() => handleVote(-1)}
        disabled={isVoting}
        aria-label="Downvote"
      >
        <ChevronDown size={size === 'small' ? 16 : 20} />
      </button>
    </div>
  )
}

