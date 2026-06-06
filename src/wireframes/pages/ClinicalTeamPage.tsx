import { useState, useEffect } from 'react'
import { Mail, User, Phone } from 'lucide-react'
import { getClinicalTeam } from '../../services/api'
import type { ClinicalTeamMember } from '../../types'
import { WireframeLayout } from '../WireframeLayout'
import { WireframeCard } from '../components'

export function ClinicalTeamPage() {
  const [teamMembers, setTeamMembers] = useState<ClinicalTeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [hasClinician, setHasClinician] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      try {
        const data = await getClinicalTeam()
        if (!cancelled) {
          setTeamMembers(data.team_members)
          setHasClinician(!!data.clinician_id)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load clinical team')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return (
    <WireframeLayout title="My Clinical Team" showBack>
      <div style={{ padding: '16px' }}>
        <p style={{ fontSize: '14px', color: 'var(--wf-gray-600)', marginBottom: '16px' }}>
          Your clinical team, managed by your care team. Contact details are provided for your reference only.
        </p>

        {error && (
          <p style={{ fontSize: 13, color: '#991b1b', background: '#fef2f2', padding: '12px 16px', borderRadius: 12, marginBottom: 16 }}>
            {error}
          </p>
        )}

        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--wf-gray-500)', padding: '24px 0' }}>Loading clinical team...</p>
        ) : teamMembers.length === 0 ? (
          <WireframeCard>
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--wf-gray-500)' }}>
              <User size={32} style={{ marginBottom: 8, opacity: 0.5 }} />
              <p style={{ fontSize: 14 }}>
                {hasClinician === false
                  ? 'Associate with your clinician to see your care team.'
                  : 'No team members listed yet.'}
              </p>
              <p style={{ fontSize: 13, color: 'var(--wf-gray-400)' }}>
                Your care team will appear here once your clinician adds them.
              </p>
            </div>
          </WireframeCard>
        ) : (
          teamMembers.map((member) => (
            <WireframeCard key={member.id} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--wf-rose-100), var(--wf-rose-50))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {member.avatar_url ? (
                    <img src={member.avatar_url} alt={member.name} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--wf-rose-500)' }}>
                      {member.name.split(' ').map((n) => n[0]).join('')}
                    </span>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--wf-gray-800)' }}>{member.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--wf-gray-500)' }}>
                    {member.role}{member.specialty ? ` · ${member.specialty}` : ''}
                  </div>
                  {member.contact_email && (
                    <a href={`mailto:${member.contact_email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--wf-rose-500)', marginTop: 4 }}>
                      <Mail size={12} /> {member.contact_email}
                    </a>
                  )}
                  {member.contact_phone && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--wf-gray-500)', marginTop: 4, marginLeft: member.contact_email ? 12 : 0 }}>
                      <Phone size={12} /> {member.contact_phone}
                    </div>
                  )}
                </div>
              </div>
            </WireframeCard>
          ))
        )}
      </div>
    </WireframeLayout>
  )
}
