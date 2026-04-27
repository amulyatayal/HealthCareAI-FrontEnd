import { FormEvent, useMemo, useState } from 'react'
import { CheckCircle2, Send } from 'lucide-react'
import { WireframeLayout } from '../WireframeLayout'
import { WireframeCard } from '../components'
import { sendBreastSatisfactionPROM } from '../../services/promEmail'

type ScaleValue = 1 | 2 | 3 | 4

interface Question {
  id: string
  text: string
}

const PRE_OP_QUESTIONS: Question[] = [
  { id: 'pre-a', text: 'How you look in the mirror clothed?' },
  { id: 'pre-b', text: 'How comfortably your bras fit?' },
  { id: 'pre-c', text: 'Being able to wear clothing that is more fitted?' },
  { id: 'pre-d', text: 'How you look in the mirror unclothed?' },
]

const POST_OP_QUESTIONS: Question[] = [
  { id: 'post-a', text: 'How you look in the mirror clothed?' },
  { id: 'post-b', text: 'The shape of your reconstructed breast(s) when you are wearing a bra?' },
  { id: 'post-c', text: 'How normal you feel in your clothes?' },
  { id: 'post-d', text: 'The size of your reconstructed breast(s)?' },
  { id: 'post-e', text: 'Being able to wear clothing that is more fitted?' },
  { id: 'post-f', text: 'How your breasts are lined up in relation to each other?' },
  { id: 'post-g', text: 'How comfortably your bras fit?' },
  { id: 'post-h', text: 'The softness of your reconstructed breast(s)?' },
  { id: 'post-i', text: 'How equal in size your breasts are to each other?' },
  { id: 'post-j', text: 'How natural your reconstructed breast(s) looks?' },
  { id: 'post-k', text: 'How naturally your reconstructed breast(s) sits/hangs?' },
  { id: 'post-l', text: 'How your reconstructed breast(s) feels to touch?' },
  { id: 'post-m', text: 'How much your reconstructed breast(s) feels like a natural part of your body?' },
  { id: 'post-n', text: 'How closely matched (similar) your breasts are to each other?' },
  { id: 'post-o', text: 'How you look in the mirror unclothed?' },
]

const SCALE_OPTIONS: Array<{ value: ScaleValue; label: string }> = [
  { value: 1, label: 'Very Dissatisfied' },
  { value: 2, label: 'Somewhat Dissatisfied' },
  { value: 3, label: 'Somewhat Satisfied' },
  { value: 4, label: 'Very Satisfied' },
]

const ALL_QUESTIONS = [...PRE_OP_QUESTIONS, ...POST_OP_QUESTIONS]
const ANSWER_LABEL: Record<ScaleValue, string> = {
  1: 'Very Dissatisfied',
  2: 'Somewhat Dissatisfied',
  3: 'Somewhat Satisfied',
  4: 'Very Satisfied',
}

function getInitialAnswers(): Record<string, ScaleValue | null> {
  return ALL_QUESTIONS.reduce<Record<string, ScaleValue | null>>((acc, q) => {
    acc[q.id] = null
    return acc
  }, {})
}

export function BreastSatisfactionPROMPage() {
  const [answers, setAnswers] = useState<Record<string, ScaleValue | null>>(() => getInitialAnswers())
  const [submitting, setSubmitting] = useState(false)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const missingCount = useMemo(
    () => ALL_QUESTIONS.filter((q) => answers[q.id] == null).length,
    [answers],
  )
  const canSubmit = missingCount === 0 && !submitting

  const selectAnswer = (questionId: string, value: ScaleValue) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const questionRows = (questions: Question[]) =>
    questions.map((q) => ({
      question: q.text,
      answer: `${answers[q.id]} - ${ANSWER_LABEL[answers[q.id] as ScaleValue]}`,
    }))

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitAttempted(true)
    setToast(null)

    if (missingCount > 0) {
      setToast({ type: 'error', text: 'Please answer all questions before submitting.' })
      return
    }

    const patientName = localStorage.getItem('user_name') || 'Anonymous'
    const hospital = localStorage.getItem('selected_hospital') || undefined

    setSubmitting(true)
    try {
      await sendBreastSatisfactionPROM({
        patientName,
        hospital,
        submittedAt: new Date().toISOString(),
        preop: questionRows(PRE_OP_QUESTIONS),
        postop: questionRows(POST_OP_QUESTIONS),
      })
      setToast({ type: 'success', text: 'Responses sent successfully.' })
      setSubmitAttempted(false)
      setAnswers(getInitialAnswers())
    } catch (err) {
      console.error('[PROM] submit failed', err)
      setToast({
        type: 'error',
        text: err instanceof Error ? err.message : 'Could not send responses. Please try again.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <WireframeLayout showBack title="Breast Satisfaction (PROM)">
      <form onSubmit={handleSubmit} className="wf-prom-form">
        <WireframeCard className="wf-prom-intro-card">
          <p className="wf-prom-intro">
            Please answer every question based on the last 7 days. Your responses will be sent to the
            clinical test inbox.
          </p>
        </WireframeCard>

        <div className="wf-prom-legend-sticky-wrap">
          <div className="wf-prom-legend">
            {SCALE_OPTIONS.map((option) => (
              <div key={option.value} className="wf-prom-legend-item">
                <span className="wf-prom-legend-number">{option.value}</span>
                <span>{option.label}</span>
              </div>
            ))}
          </div>
        </div>

        <WireframeCard className="wf-prom-section-card">
          <h3 className="wf-prom-section-title">Satisfaction with Breasts (Preoperative)</h3>
          <p className="wf-prom-prompt">
            With your breast area in mind, in the past week, how satisfied or dissatisfied have you
            been with:
          </p>
          {PRE_OP_QUESTIONS.map((q, index) => (
            <div
              key={q.id}
              className={`wf-prom-row ${submitAttempted && answers[q.id] == null ? 'wf-prom-row-missing' : ''}`}
            >
              <p className="wf-prom-question">
                {String.fromCharCode(97 + index)}. {q.text}
              </p>
              <div className="wf-prom-scale">
                {SCALE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`wf-prom-scale-btn ${answers[q.id] === option.value ? 'active' : ''}`}
                    onClick={() => selectAnswer(q.id, option.value)}
                    title={option.label}
                  >
                    {option.value}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </WireframeCard>

        <WireframeCard className="wf-prom-section-card">
          <h3 className="wf-prom-section-title">Satisfaction with Breasts (Postoperative)</h3>
          <p className="wf-prom-prompt">
            If you have had a mastectomy and reconstruction of both breasts, answer these questions
            thinking of the breast you are least satisfied with.
          </p>
          <p className="wf-prom-prompt">
            With your breasts in mind, in the past week, how satisfied or dissatisfied have you been
            with:
          </p>
          {POST_OP_QUESTIONS.map((q, index) => (
            <div
              key={q.id}
              className={`wf-prom-row ${submitAttempted && answers[q.id] == null ? 'wf-prom-row-missing' : ''}`}
            >
              <p className="wf-prom-question">
                {String.fromCharCode(97 + index)}. {q.text}
              </p>
              <div className="wf-prom-scale">
                {SCALE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`wf-prom-scale-btn ${answers[q.id] === option.value ? 'active' : ''}`}
                    onClick={() => selectAnswer(q.id, option.value)}
                    title={option.label}
                  >
                    {option.value}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </WireframeCard>

        <WireframeCard>
          <button type="submit" className="wf-btn wf-btn-primary wf-btn-full" disabled={!canSubmit}>
            <Send size={16} />
            {submitting ? 'Sending...' : 'Submit Answers'}
          </button>
          <p className="wf-prom-help-text">
            {missingCount === 0
              ? 'All questions answered.'
              : `${missingCount} question${missingCount === 1 ? '' : 's'} remaining.`}
          </p>
          {toast && (
            <div className={`wf-prom-toast wf-prom-toast-${toast.type}`}>
              {toast.type === 'success' && <CheckCircle2 size={16} />}
              <span>{toast.text}</span>
            </div>
          )}
        </WireframeCard>
      </form>
    </WireframeLayout>
  )
}
