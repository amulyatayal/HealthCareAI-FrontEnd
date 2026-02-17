import { useState, useEffect } from 'react'
import { Mail, User, Plus, Trash2, X, Check } from 'lucide-react'
import { WireframeLayout } from '../WireframeLayout'
import { WireframeCard } from '../components'

interface TeamMemberData {
  id: string
  name: string
  role: string
  specialty: string | null
  avatar_url: string | null
  contact_email: string | null
}

const defaultTeamMembers: TeamMemberData[] = [
  { id: '1', name: 'Ms X', role: 'Consultant surgeon', specialty: null, avatar_url: null, contact_email: null },
  { id: '2', name: 'Miss Y', role: 'CNS', specialty: null, avatar_url: null, contact_email: null },
  { id: '3', name: 'Dr Z', role: 'Oncologist', specialty: null, avatar_url: null, contact_email: null },
]

export function ClinicalTeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMemberData[]>(defaultTeamMembers)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newRole, setNewRole] = useState('')
  const [newSpecialty, setNewSpecialty] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [adding, setAdding] = useState(false)
  const [removing, setRemoving] = useState<string | null>(null)
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const { getClinicalTeam } = await import('../../services/api')
        const data = await getClinicalTeam()
        if (!cancelled && data.team_members.length > 0) {
          setTeamMembers(data.team_members)
        }
      } catch {
        // API not available
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const handleAdd = async () => {
    if (!newName.trim() || !newRole.trim()) return
    setAdding(true)
    try {
      const { addClinicalTeamMember } = await import('../../services/api')
      const result = await addClinicalTeamMember({
        name: newName.trim(),
        role: newRole.trim(),
        specialty: newSpecialty.trim() || undefined,
        contact_email: newEmail.trim() || undefined,
      })
      setTeamMembers((prev) => [...prev, { id: result.id, name: result.name, role: result.role, specialty: result.specialty, avatar_url: result.avatar_url, contact_email: result.contact_email }])
    } catch {
      // API not available — add locally
      setTeamMembers((prev) => [...prev, {
        id: `local_${Date.now()}`,
        name: newName.trim(),
        role: newRole.trim(),
        specialty: newSpecialty.trim() || null,
        avatar_url: null,
        contact_email: newEmail.trim() || null,
      }])
    }
    setNewName('')
    setNewRole('')
    setNewSpecialty('')
    setNewEmail('')
    setShowAddForm(false)
    setAdding(false)
  }

  const handleRemove = async (id: string) => {
    setRemoving(id)
    try {
      const { removeClinicalTeamMember } = await import('../../services/api')
      await removeClinicalTeamMember(id)
    } catch {
      // API not available
    }
    setTeamMembers((prev) => prev.filter((m) => m.id !== id))
    setRemoving(null)
    setConfirmRemove(null)
  }

  return (
    <WireframeLayout title="My Clinical Team" showBack>
      <div style={{ padding: '16px' }}>
        <p style={{ fontSize: '14px', color: 'var(--wf-gray-600)', marginBottom: '16px' }}>
          Manage your clinical team members. This is self-reported — add the clinicians involved in your care.
        </p>

        {/* Add button */}
        {!showAddForm && (
          <button
            className="wf-btn wf-btn-outline wf-btn-full"
            style={{ marginBottom: 16 }}
            onClick={() => setShowAddForm(true)}
          >
            <Plus size={18} />
            Add Team Member
          </button>
        )}

        {/* Add form */}
        {showAddForm && (
          <WireframeCard style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--wf-gray-800)', marginBottom: 12 }}>
              Add a team member
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                type="text"
                placeholder="Name *"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid var(--wf-gray-200)', fontSize: 14 }}
              />
              <input
                type="text"
                placeholder="Role * (e.g. Oncologist, CNS, Surgeon)"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid var(--wf-gray-200)', fontSize: 14 }}
              />
              <input
                type="text"
                placeholder="Specialty (optional)"
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid var(--wf-gray-200)', fontSize: 14 }}
              />
              <input
                type="email"
                placeholder="Contact email (optional)"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid var(--wf-gray-200)', fontSize: 14 }}
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className="wf-btn wf-btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => { setShowAddForm(false); setNewName(''); setNewRole(''); setNewSpecialty(''); setNewEmail('') }}
                >
                  <X size={16} /> Cancel
                </button>
                <button
                  className="wf-btn wf-btn-primary"
                  style={{ flex: 1 }}
                  onClick={handleAdd}
                  disabled={!newName.trim() || !newRole.trim() || adding}
                >
                  <Check size={16} /> {adding ? 'Adding...' : 'Add'}
                </button>
              </div>
            </div>
          </WireframeCard>
        )}

        {/* Team members list */}
        {teamMembers.length === 0 ? (
          <WireframeCard>
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--wf-gray-500)' }}>
              <User size={32} style={{ marginBottom: 8, opacity: 0.5 }} />
              <p style={{ fontSize: 14 }}>No clinical team members yet.</p>
              <p style={{ fontSize: 13, color: 'var(--wf-gray-400)' }}>
                Add the clinicians involved in your care using the button above.
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
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--wf-gray-800)' }}>{member.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--wf-gray-500)' }}>{member.role}{member.specialty ? ` · ${member.specialty}` : ''}</div>
                  {member.contact_email && (
                    <a href={`mailto:${member.contact_email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--wf-rose-500)', marginTop: 4 }}>
                      <Mail size={12} /> {member.contact_email}
                    </a>
                  )}
                </div>
                {/* Remove button */}
                {confirmRemove === member.id ? (
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button
                      style={{ padding: '6px 10px', fontSize: 11, background: '#dc2626', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}
                      onClick={() => handleRemove(member.id)}
                      disabled={removing === member.id}
                    >
                      {removing === member.id ? '...' : 'Remove'}
                    </button>
                    <button
                      style={{ padding: '6px 10px', fontSize: 11, background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 6, cursor: 'pointer' }}
                      onClick={() => setConfirmRemove(null)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    className="wf-icon-btn"
                    style={{ color: '#dc2626' }}
                    onClick={() => setConfirmRemove(member.id)}
                    title="Remove team member"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </WireframeCard>
          ))
        )}
      </div>
    </WireframeLayout>
  )
}
