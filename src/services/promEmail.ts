import emailjs from '@emailjs/browser'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
const TO_EMAIL = import.meta.env.VITE_PROM_RECIPIENT_EMAIL

interface PromAnswerRow {
  question: string
  answer: string
}

interface BreastSatisfactionPromPayload {
  patientName: string
  hospital?: string
  submittedAt: string
  preop: PromAnswerRow[]
  postop: PromAnswerRow[]
}

function formatRows(rows: PromAnswerRow[]): string {
  return rows.map((row, index) => `${index + 1}. ${row.question}\n   - ${row.answer}`).join('\n')
}

export async function sendBreastSatisfactionPROM(payload: BreastSatisfactionPromPayload) {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY || !TO_EMAIL) {
    throw new Error(
      'EmailJS is not configured. Set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY, and VITE_PROM_RECIPIENT_EMAIL.',
    )
  }

  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      to_email: TO_EMAIL,
      subject: `PROM - Breast Satisfaction - ${payload.patientName}`,
      patient_name: payload.patientName,
      hospital: payload.hospital ?? '-',
      submitted_at: payload.submittedAt,
      preop_block: formatRows(payload.preop),
      postop_block: formatRows(payload.postop),
    },
    {
      publicKey: PUBLIC_KEY,
    },
  )
}
