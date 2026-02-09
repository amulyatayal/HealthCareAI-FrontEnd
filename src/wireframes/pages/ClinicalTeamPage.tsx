import { WireframeLayout } from '../WireframeLayout'
import { WireframeCard } from '../components'

const teamMembers = [
  { name: 'Ms X', role: 'Consultant surgeon' },
  { name: 'Miss Y', role: 'CNS' },
  { name: 'Dr Z', role: 'Oncologist' },
]

export function ClinicalTeamPage() {
  return (
    <WireframeLayout title="Meet your clinical team" showBack>
      <div style={{ padding: '16px' }}>
        <p style={{ fontSize: '14px', color: 'var(--wf-gray-600)', marginBottom: '16px' }}>
          Your clinical team members.
        </p>
        <WireframeCard>
          {teamMembers.map((member, i) => (
            <div
              key={member.name}
              className="wf-list-item"
              style={{
                borderBottom: i < teamMembers.length - 1 ? '1px solid var(--wf-gray-100)' : 'none',
              }}
            >
              <div
                className="wf-list-avatar"
                style={{ background: 'linear-gradient(135deg, var(--wf-rose-100), var(--wf-rose-50))' }}
              >
                <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--wf-rose-600)' }}>
                  {member.name.charAt(0)}
                </span>
              </div>
              <div className="wf-list-content">
                <div className="wf-list-title">{member.name}</div>
                <div className="wf-list-subtitle">{member.role}</div>
              </div>
            </div>
          ))}
        </WireframeCard>
      </div>
    </WireframeLayout>
  )
}
