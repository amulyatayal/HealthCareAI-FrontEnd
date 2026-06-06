import emailjs from '@emailjs/browser'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
const TO_EMAIL = import.meta.env.VITE_PROM_RECIPIENT_EMAIL

interface PromAnswerRow {
  question: string
  answer: string
}

export interface BreastSatisfactionPromPayload {
  patientName: string
  hospital?: string
  submittedAt: string
  preop: PromAnswerRow[]
  postop: PromAnswerRow[]
}

function formatRows(rows: PromAnswerRow[]): string {
  return rows.map((row, index) => `${index + 1}. ${row.question}\n   - ${row.answer}`).join('\n')
}

export interface PromEmailPreview {
  toEmail: string
  subject: string
  patientName: string
  hospital: string
  submittedAt: string
  preopBlock: string
  postopBlock: string
}

export interface PromSendResult {
  mode: 'real' | 'mock'
  preview: PromEmailPreview
}

export function buildBreastSatisfactionPromPreview(
  payload: BreastSatisfactionPromPayload,
): PromEmailPreview {
  return {
    toEmail: TO_EMAIL || '(not configured)',
    subject: `PROM - Breast Satisfaction - ${payload.patientName}`,
    patientName: payload.patientName,
    hospital: payload.hospital ?? '-',
    submittedAt: payload.submittedAt,
    preopBlock: formatRows(payload.preop),
    postopBlock: formatRows(payload.postop),
  }
}

export async function sendBreastSatisfactionPROM(
  payload: BreastSatisfactionPromPayload,
): Promise<PromSendResult> {
  const preview = buildBreastSatisfactionPromPreview(payload)

  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY || !TO_EMAIL) {
    console.info('[PROM] EmailJS not configured, using mock send', preview)
    return { mode: 'mock', preview }
  }

  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_email: preview.toEmail,
        subject: preview.subject,
        patient_name: preview.patientName,
        hospital: preview.hospital,
        submitted_at: preview.submittedAt,
        preop_block: preview.preopBlock,
        postop_block: preview.postopBlock,
      },
      {
        publicKey: PUBLIC_KEY,
      },
    )
    return { mode: 'real', preview }
  } catch (error) {
    console.info('[PROM] EmailJS send failed, using mock fallback', error, preview)
    return { mode: 'mock', preview }
  }
}
