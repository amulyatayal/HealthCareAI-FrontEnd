import { WireframeCard } from '../../../wireframes/components'

interface Props {
  quote: { text: string; author: string }
}

export function DailyQuote({ quote }: Props) {
  return (
    <WireframeCard className="wf-quote-card">
      <div className="quote-icon">💜</div>
      <p className="quote-text">"{quote.text}"</p>
      <p className="quote-author">— {quote.author}</p>
    </WireframeCard>
  )
}
