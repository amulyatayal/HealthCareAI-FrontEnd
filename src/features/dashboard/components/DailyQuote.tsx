interface Props {
  quote: { text: string; author: string }
}

export function InlineDailyQuote({ quote }: Props) {
  return (
    <div className="wf-hero-quote">
      <p className="wf-hero-quote-text">&ldquo;{quote.text}&rdquo;</p>
      <p className="wf-hero-quote-author">— {quote.author}</p>
    </div>
  )
}

/** @deprecated Use InlineDailyQuote inside HeroWelcome */
export function DailyQuote({ quote }: Props) {
  return <InlineDailyQuote quote={quote} />
}
