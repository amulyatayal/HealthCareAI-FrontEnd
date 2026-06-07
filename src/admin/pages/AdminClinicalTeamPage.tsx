import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Users, Mail, Phone, X, AlertCircle } from 'lucide-react'
import {
  getAdminClinicalTeam,
  createClinicalTeamMember,
  updateClinicalTeamMember,
  deleteClinicalTeamMember,
} from '../../services/adminApi'
import type { ClinicalTeamMemberApi } from '../../types/admin'

interface TeamFormState {
  name: string
  role: string
  specialty: string
  contact_email: string
  contact_phone: string
}

const EMPTY_FORM: TeamFormState = {
  name: '',
  role: '',
  specialty: '',
  contact_email: '',
  contact_phone: '',
}

function memberToForm(m: ClinicalTeamMemberApi): TeamFormState {
  return {
    name: m.name,
    role: m.role,
    specialty: m.specialty ?? '',
    contact_email: m.contact_email ?? '',
    contact_phone: m.contact_phone ?? '',
  }
}

function formToRequest(form: TeamFormState) {
  return {
    name: form.name.trim(),
    role: form.role.trim(),
    specialty: form.specialty.trim() || null,
    contact_email: form.contact_email.trim() || null,
    contact_phone: form.contact_phone.trim() || null,
  }
}

function getMemberId(m: ClinicalTeamMemberApi): string {
  return m.id?.trim() || ''
}

export function AdminClinicalTeamPage() {
  const [members, setMembers] = useState<ClinicalTeamMemberApi[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<TeamFormState>(EMPTY_FORM)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  useEffect(() => {
    loadTeam()
  }, [])

  async function loadTeam() {
    setLoading(true)
    setError('')
    try {
      const data = await getAdminClinicalTeam()
      setMembers(data.team_members)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load clinical team')
    } finally {
      setLoading(false)
    }
  }

  function openCreate() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setShowForm(true)
  }

  function openEdit(member: ClinicalTeamMemberApi) {
    const id = getMemberId(member)
    if (!id) {
      setError('Cannot edit: team member ID is missing')
      return
    }
    setForm(memberToForm(member))
    setEditingId(id)
    setShowForm(true)
  }

  async function handleSave() {
    if (!form.name.trim() || !form.role.trim()) return

    setSaving(true)
    setError('')
    try {
      const payload = formToRequest(form)
      if (editingId) {
        if (!editingId.trim()) {
          setError('Cannot save: team member ID is missing')
          return
        }
        const { team_member } = await updateClinicalTeamMember(editingId, payload)
        setMembers((prev) => prev.map((m) => (getMemberId(m) === editingId ? team_member : m)))
      } else {
        const { team_member } = await createClinicalTeamMember(payload)
        setMembers((prev) => [...prev, team_member])
      }
      setShowForm(false)
      setEditingId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save team member')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!id?.trim()) {
      setError('Cannot remove: team member ID is missing')
      return
    }
    setError('')
    try {
      await deleteClinicalTeamMember(id)
      setMembers((prev) => prev.filter((m) => getMemberId(m) !== id))
      setConfirmDelete(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove team member')
    }
  }

  return (
    <>
      <div className="admin-page-header">
        <h1>Clinical Team</h1>
        <p>Manage the care team roster shown to patients associated with you.</p>
      </div>

      {error && (
        <div className="admin-ac-error">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div className="admin-ct-toolbar">
        <button className="admin-ct-btn-create" onClick={openCreate}>
          <Plus size={16} /> Add Team Member
        </button>
        <span className="admin-ct-count">{members.length} member{members.length !== 1 && 's'}</span>
      </div>

      {showForm && (
        <div className="admin-ct-modal-backdrop" onClick={() => setShowForm(false)}>
          <div className="admin-ct-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-ct-modal-header">
              <h3>{editingId ? 'Edit Team Member' : 'Add Team Member'}</h3>
              <button className="admin-ct-modal-close" onClick={() => setShowForm(false)}><X size={18} /></button>
            </div>
            <div className="admin-ct-form">
              <label>
                Name *
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Dr Jane Smith" />
              </label>
              <label>
                Role *
                <input type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Consultant surgeon, CNS, Oncologist" />
              </label>
              <label>
                Specialty
                <input type="text" value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} placeholder="Breast surgery (optional)" />
              </label>
              <label>
                Contact email
                <input type="email" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} placeholder="email@hospital.nhs.uk" />
              </label>
              <label>
                Contact phone
                <input type="tel" value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} placeholder="+44 ... (optional)" />
              </label>
              <div className="admin-ct-form-actions">
                <button
                  className="admin-ct-btn-save"
                  onClick={handleSave}
                  disabled={saving || !form.name.trim() || !form.role.trim()}
                >
                  {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Add Member'}
                </button>
                <button className="admin-ct-btn-cancel" onClick={() => setShowForm(false)} disabled={saving}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="admin-ac-loading">Loading clinical team...</div>
      ) : members.length === 0 ? (
        <div className="admin-ct-empty">
          <Users size={40} strokeWidth={1.2} />
          <h3>No team members yet</h3>
          <p>Add colleagues to build the care team your patients will see.</p>
        </div>
      ) : (
        <div className="admin-ct-list">
          {members.map((member) => {
            const id = getMemberId(member)
            const initials = member.name.split(' ').map((n) => n[0]).join('').slice(0, 2)

            return (
              <div key={id || member.name} className="admin-ct-card">
                <div className="admin-ct-avatar">{initials}</div>
                <div className="admin-ct-card-body">
                  <h3 className="admin-ct-card-name">{member.name}</h3>
                  <p className="admin-ct-card-role">
                    {member.role}
                    {member.specialty ? ` · ${member.specialty}` : ''}
                  </p>
                  <div className="admin-ct-card-contact">
                    {member.contact_email && (
                      <span><Mail size={13} /> {member.contact_email}</span>
                    )}
                    {member.contact_phone && (
                      <span><Phone size={13} /> {member.contact_phone}</span>
                    )}
                  </div>
                </div>
                <div className="admin-ct-card-actions">
                  <button onClick={() => openEdit(member)} title="Edit"><Edit2 size={14} /> Edit</button>
                  {confirmDelete === id ? (
                    <span className="admin-ct-confirm">
                      <span>Remove?</span>
                      <button className="admin-ct-btn-yes" onClick={() => handleDelete(id)}>Yes</button>
                      <button className="admin-ct-btn-no" onClick={() => setConfirmDelete(null)}>No</button>
                    </span>
                  ) : (
                    <button className="admin-ct-btn-delete" onClick={() => setConfirmDelete(id)} title="Remove">
                      <Trash2 size={14} /> Remove
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
