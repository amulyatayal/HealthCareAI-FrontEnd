import { useState, useEffect } from 'react'
import { FileText, Calendar, Settings, Shield, LogOut, ChevronRight, User, Compass, Share2, Download, Trash2, ToggleLeft, Check, Clock, Search, MessageCircle, UserPlus, AlertTriangle, BookOpen, Database, Mail, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { WireframeLayout } from '../WireframeLayout'
import { WireframeCard } from '../components'
import { useBasePath } from '../hooks/useBasePath'
import { useAuth } from '../../contexts/AuthContext'
import { getStoredDataConsent, saveDataConsent, clearDataConsent, type DataConsentChoices } from '../../components/gdpr/DataConsentScreen'
import { getEthicsCommittee, isIndiaJurisdiction } from '../../utils/jurisdiction'
import { recordDataConsent, withdrawConsent, exportMyData, deleteMyAccount, saveNominee, getNominee } from '../../services/api'
import type { DataConsentPayload } from '../../services/api'

export function ProfilePage() {
  const base = useBasePath()
  const { user, logout } = useAuth()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [exporting, setExporting] = useState(false)
  const [exported, setExported] = useState(false)
  const [showConsentManager, setShowConsentManager] = useState(false)
  const [consentChoices, setConsentChoices] = useState<DataConsentChoices>(() => {
    const stored = getStoredDataConsent()
    return stored?.choices ?? {
      coreService: true,
      healthData: false,
      aiModelProviders: false,
      documentStorage: false,
      community: false,
      clinicalSharing: true,
    }
  })
  const [consentSaved, setConsentSaved] = useState(false)
  const [showActivityLog, setShowActivityLog] = useState(false)
  const [activityLog, setActivityLog] = useState<{ id: string; type: string; description: string; timestamp: string }[]>([])
  const [loadingActivity, setLoadingActivity] = useState(false)
  const [navMode, setNavMode] = useState<'ai' | 'search'>(() => {
    try {
      return localStorage.getItem('nav_mode') === 'search' ? 'search' : 'ai'
    } catch { return 'ai' }
  })

  const isIndia = isIndiaJurisdiction()
  const ec = getEthicsCommittee()

  const [showNominee, setShowNominee] = useState(false)
  const [nominee, setNominee] = useState(() => {
    try {
      const stored = localStorage.getItem('dpdpa_nominee')
      return stored ? JSON.parse(stored) : { name: '', relationship: '', email: '', phone: '' }
    } catch { return { name: '', relationship: '', email: '', phone: '' } }
  })
  const [nomineeSaved, setNomineeSaved] = useState(false)

  const [showGrievance, setShowGrievance] = useState(false)
  const [grievance, setGrievance] = useState({ subject: '', description: '' })
  const [grievanceSubmitted, setGrievanceSubmitted] = useState(false)

  const [showEthicsCommittee, setShowEthicsCommittee] = useState(false)
  const [showRetention, setShowRetention] = useState(false)

  const [exportError, setExportError] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [nomineeError, setNomineeError] = useState('')

  function toPayload(c: DataConsentChoices): DataConsentPayload {
    return {
      core_service: true,
      health_data: c.healthData,
      ai_model_providers: c.aiModelProviders,
      document_storage: c.documentStorage,
      community: c.community,
      clinical_sharing: true,
    }
  }

  useEffect(() => {
    if (!isIndia) return
    let cancelled = false
    getNominee().then((data) => {
      if (!cancelled && data) {
        setNominee(data)
        localStorage.setItem('dpdpa_nominee', JSON.stringify(data))
      }
    })
    return () => { cancelled = true }
  }, [isIndia])

  const handleExportData = async () => {
    setExporting(true)
    setExportError('')
    try {
      const blob = await exportMyData()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'tara-data-export.zip'
      a.click()
      URL.revokeObjectURL(url)
      setExported(true)
      setTimeout(() => setExported(false), 3000)
    } catch (err) {
      console.error('Export failed:', err)
      setExportError(err instanceof Error ? err.message : 'Export failed. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE MY ACCOUNT') return
    setDeleteError('')
    try {
      await deleteMyAccount('DELETE MY ACCOUNT')
      localStorage.clear()
      window.location.href = '/'
    } catch (err) {
      console.error('Delete failed:', err)
      setDeleteError(err instanceof Error ? err.message : 'Deletion failed. Please try again.')
    }
  }

  const menuItems = [
    {
      icon: Compass,
      title: 'Treatment pathway',
      subtitle: 'Which area you need more information about',
      to: `${base}/profile/stage`,
    },
    {
      icon: FileText,
      title: 'My Documents',
      subtitle: 'Upload and manage medical records',
      to: `${base}/profile/documents`,
    },
    {
      icon: Calendar,
      title: 'Appointments',
      subtitle: 'Manage reminders and schedule',
      to: `${base}/profile/appointments`,
    },
    {
      icon: Share2,
      title: 'Share my Data',
      subtitle: 'Send my data to my clinician',
      to: `${base}/profile/share`,
    },
    {
      icon: Settings,
      title: 'Settings',
      subtitle: 'App preferences',
      to: `${base}/profile`,
    },
  ]

  return (
    <WireframeLayout>
      {/* Profile Header */}
      <WireframeCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div 
            style={{ 
              width: '72px', 
              height: '72px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, var(--wf-rose-300), var(--wf-rose-400))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '28px',
              fontWeight: '600'
            }}
          >
            <User size={32} />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--wf-gray-800)' }}>
              {user?.name || 'Guest User'}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--wf-gray-500)' }}>
              {user?.email || (user?.isGuest ? 'Guest account' : '')}
            </p>
            <span className="wf-badge wf-badge-success" style={{ marginTop: '4px' }}>
              {user?.isGuest ? 'Guest' : 'Verified Member'}
            </span>
          </div>
        </div>
      </WireframeCard>

      {/* Quick Stats */}
      <div className="wf-grid-3">
        <WireframeCard className="wf-stat-card">
          <div className="wf-stat-value" style={{ fontSize: '24px' }}>45</div>
          <div className="wf-stat-label">Days Active</div>
        </WireframeCard>
        <WireframeCard className="wf-stat-card">
          <div className="wf-stat-value" style={{ fontSize: '24px' }}>12</div>
          <div className="wf-stat-label">Documents</div>
        </WireframeCard>
        <WireframeCard className="wf-stat-card">
          <div className="wf-stat-value" style={{ fontSize: '24px' }}>3</div>
          <div className="wf-stat-label">Buddies</div>
        </WireframeCard>
      </div>

      {/* Menu Items */}
      <div className="wf-section-header">
        <span className="wf-section-title">Account</span>
      </div>

      {menuItems.map((item) => (
        <Link 
          key={item.title} 
          to={item.to} 
          style={{ textDecoration: 'none' }}
        >
          <div className="wf-list-item" style={{ background: 'white', borderRadius: '12px', marginBottom: '8px' }}>
            <div 
              className="wf-icon-btn" 
              style={{ background: 'var(--wf-rose-50)', color: 'var(--wf-rose-500)' }}
            >
              <item.icon size={20} />
            </div>
            <div className="wf-list-content">
              <div className="wf-list-title">{item.title}</div>
              <div className="wf-list-subtitle">{item.subtitle}</div>
            </div>
            <ChevronRight size={18} style={{ color: 'var(--wf-gray-400)' }} />
          </div>
        </Link>
      ))}

      {/* Navigation Mode Toggle */}
      <div className="wf-section-header">
        <span className="wf-section-title">Navigation Mode</span>
      </div>

      <WireframeCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--wf-gray-800)', marginBottom: 4 }}>
              {navMode === 'ai' ? 'Ask Tara (AI)' : 'Search Resources'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--wf-gray-500)', lineHeight: 1.4 }}>
              {navMode === 'ai'
                ? 'AI-powered assistant answers your questions'
                : 'Keyword search across resources from your care team'}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const next = navMode === 'ai' ? 'search' : 'ai'
              setNavMode(next)
              localStorage.setItem('nav_mode', next)
              window.dispatchEvent(new Event('nav_mode_changed'))
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              border: '1px solid var(--wf-gray-200)',
              borderRadius: 20,
              background: 'var(--wf-gray-50)',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--wf-gray-700)',
              whiteSpace: 'nowrap',
            }}
          >
            {navMode === 'ai' ? <Search size={14} /> : <MessageCircle size={14} />}
            Switch to {navMode === 'ai' ? 'Search' : 'Ask Tara'}
          </button>
        </div>
      </WireframeCard>

      {/* Privacy & Data Rights (GDPR) */}
      <div className="wf-section-header">
        <span className="wf-section-title">Privacy & Data Rights</span>
      </div>

      <button
        type="button"
        onClick={handleExportData}
        disabled={exporting}
        className="wf-list-item"
        style={{ background: 'white', borderRadius: '12px', marginBottom: '8px', width: '100%', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <div className="wf-icon-btn" style={{ background: '#dbeafe', color: '#2563eb' }}>
          <Download size={20} />
        </div>
        <div className="wf-list-content">
          <div className="wf-list-title">{exported ? 'Export started!' : exporting ? 'Preparing...' : 'Download my data'}</div>
          <div className="wf-list-subtitle">{exportError || 'Export all your data (GDPR Art. 20)'}</div>
        </div>
      </button>

      <Link to="/privacy" style={{ textDecoration: 'none' }}>
        <div className="wf-list-item" style={{ background: 'white', borderRadius: '12px', marginBottom: '8px' }}>
          <div className="wf-icon-btn" style={{ background: '#f3e8ff', color: '#9333ea' }}>
            <Shield size={20} />
          </div>
          <div className="wf-list-content">
            <div className="wf-list-title">Privacy Policy</div>
            <div className="wf-list-subtitle">How we process and protect your data</div>
          </div>
          <ChevronRight size={18} style={{ color: 'var(--wf-gray-400)' }} />
        </div>
      </Link>

      {/* Manage Data Consent */}
      <button
        type="button"
        onClick={() => setShowConsentManager(!showConsentManager)}
        className="wf-list-item"
        style={{ background: 'white', borderRadius: '12px', marginBottom: '8px', width: '100%', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <div className="wf-icon-btn" style={{ background: '#fff1f2', color: '#f43f5e' }}>
          <ToggleLeft size={20} />
        </div>
        <div className="wf-list-content">
          <div className="wf-list-title">Manage Data Consent</div>
          <div className="wf-list-subtitle">Review or withdraw your data choices</div>
        </div>
        <ChevronRight size={18} style={{ color: 'var(--wf-gray-400)', transform: showConsentManager ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {showConsentManager && (
        <WireframeCard>
          <p style={{ fontSize: 13, color: 'var(--wf-gray-600)', marginBottom: 12, lineHeight: 1.5 }}>
            You can change your consent choices below. Withdrawing consent will disable the corresponding features.
          </p>

          {/* Informational: Core Service */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--wf-gray-100)' }}>
            <span style={{ fontSize: 11, color: '#6b7280', background: '#f3f4f6', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>✓</span>
            <span style={{ fontSize: 14, color: 'var(--wf-gray-800)' }}>Core Service (always on — contract basis)</span>
          </div>

          {/* Toggleable consent items */}
          {([
            { key: 'healthData' as const, label: 'Health Data — explicit consent (Art. 9(2)(a))' },
            { key: 'aiModelProviders' as const, label: 'AI Model Providers (third-party processing)' },
            { key: 'documentStorage' as const, label: 'Document Storage' },
            { key: 'community' as const, label: 'Community Features' },
          ]).map(({ key, label }) => (
            <label
              key={key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 0',
                borderBottom: '1px solid var(--wf-gray-100)',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={consentChoices[key]}
                onChange={() => setConsentChoices((prev) => ({ ...prev, [key]: !prev[key] }))}
                style={{ width: 18, height: 18, accentColor: key === 'healthData' ? '#dc2626' : '#f43f5e' }}
              />
              <span style={{ fontSize: 14, color: 'var(--wf-gray-800)' }}>{label}</span>
            </label>
          ))}

          {/* Informational: Clinical Sharing */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--wf-gray-100)' }}>
            <span style={{ fontSize: 11, color: '#16a34a', background: '#f0fdf4', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>↗</span>
            <span style={{ fontSize: 14, color: 'var(--wf-gray-800)' }}>Clinical Data Sharing (per-event consent)</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button
              className="wf-btn wf-btn-sm"
              style={{ flex: 1, background: '#f43f5e', color: 'white', border: 'none', borderRadius: 8, padding: '10px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              onClick={() => {
                saveDataConsent(consentChoices)
                recordDataConsent(toPayload(consentChoices), 'profile_update').catch((err) => {
                  console.error('[Profile] Consent sync failed:', err)
                })
                setConsentSaved(true)
                setTimeout(() => setConsentSaved(false), 2500)
              }}
            >
              {consentSaved ? <><Check size={14} /> Saved</> : 'Save Changes'}
            </button>
            <button
              className="wf-btn wf-btn-sm wf-btn-secondary"
              style={{ flex: 1 }}
              onClick={() => {
                clearDataConsent()
                withdrawConsent('data').catch((err) => {
                  console.error('[Profile] Consent withdrawal failed:', err)
                })
                window.location.reload()
              }}
            >
              Reset All
            </button>
          </div>
          <p style={{ fontSize: 11, color: 'var(--wf-gray-400)', marginTop: 8, textAlign: 'center' }}>
            "Reset All" withdraws data consent and shows the consent screen again.
          </p>
        </WireframeCard>
      )}

      {/* Activity Log */}
      <button
        type="button"
        onClick={async () => {
          if (showActivityLog) { setShowActivityLog(false); return }
          setShowActivityLog(true)
          setLoadingActivity(true)
          try {
            const { getActivityLog } = await import('../../services/api')
            const data = await getActivityLog(20)
            setActivityLog(data.activities ?? [])
          } catch (err) {
            console.error('[Profile] Activity log failed:', err)
            setActivityLog([])
          }
          setLoadingActivity(false)
        }}
        className="wf-list-item"
        style={{ background: 'white', borderRadius: '12px', marginBottom: '8px', width: '100%', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <div className="wf-icon-btn" style={{ background: '#f3e8ff', color: '#9333ea' }}>
          <Clock size={20} />
        </div>
        <div className="wf-list-content">
          <div className="wf-list-title">Activity Log</div>
          <div className="wf-list-subtitle">View consent changes, data shares, exports</div>
        </div>
        <ChevronRight size={18} style={{ color: 'var(--wf-gray-400)', transform: showActivityLog ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {showActivityLog && (
        <WireframeCard>
          {loadingActivity ? (
            <p style={{ textAlign: 'center', color: 'var(--wf-gray-500)', padding: 16, fontSize: 13 }}>Loading activity log...</p>
          ) : activityLog.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--wf-gray-500)', padding: 16, fontSize: 13 }}>No activity recorded yet.</p>
          ) : (
            activityLog.map((entry) => (
              <div
                key={entry.id}
                style={{
                  display: 'flex',
                  gap: 10,
                  padding: '10px 0',
                  borderBottom: '1px solid var(--wf-gray-100)',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  marginTop: 6,
                  flexShrink: 0,
                  background: entry.type.includes('withdraw') ? '#dc2626' : entry.type.includes('consent') ? '#16a34a' : entry.type.includes('share') ? '#2563eb' : '#9ca3af',
                }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, color: 'var(--wf-gray-800)', marginBottom: 2 }}>{entry.description}</p>
                  <p style={{ fontSize: 11, color: 'var(--wf-gray-400)' }}>
                    {new Date(entry.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          )}
        </WireframeCard>
      )}

      {/* Ethics Committee Disclosure — all jurisdictions */}
      <button
        type="button"
        onClick={() => setShowEthicsCommittee(!showEthicsCommittee)}
        className="wf-list-item"
        style={{ background: 'white', borderRadius: '12px', marginBottom: '8px', width: '100%', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <div className="wf-icon-btn" style={{ background: '#ecfdf5', color: '#059669' }}>
          <BookOpen size={20} />
        </div>
        <div className="wf-list-content">
          <div className="wf-list-title">Ethics Committee Approval</div>
          <div className="wf-list-subtitle">Institutional review and oversight details</div>
        </div>
        <ChevronRight size={18} style={{ color: 'var(--wf-gray-400)', transform: showEthicsCommittee ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {showEthicsCommittee && (
        <WireframeCard>
          {ec ? (
            <div style={{ fontSize: 13, color: 'var(--wf-gray-700)', lineHeight: 1.7 }}>
              <p style={{ fontWeight: 600, marginBottom: 8, color: 'var(--wf-gray-800)' }}>
                This application has been reviewed and approved by:
              </p>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: 14, marginBottom: 12 }}>
                <p style={{ fontWeight: 600, marginBottom: 4 }}>{ec.name}</p>
                <p>Approval Reference: <strong>{ec.approvalRef}</strong></p>
                <p>Valid until: {new Date(ec.validUntil).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <p style={{ fontWeight: 600, marginBottom: 6 }}>Contact the Ethics Committee:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <a href={`mailto:${ec.contactEmail}`} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#2563eb', textDecoration: 'none', fontSize: 13 }}>
                  <Mail size={14} /> {ec.contactEmail}
                </a>
                {ec.contactPhone && (
                  <a href={`tel:${ec.contactPhone}`} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#2563eb', textDecoration: 'none', fontSize: 13 }}>
                    <Phone size={14} /> {ec.contactPhone}
                  </a>
                )}
              </div>
              <p style={{ marginTop: 12, fontSize: 12, color: 'var(--wf-gray-500)', lineHeight: 1.5 }}>
                If you have concerns about how this app handles your data, you may contact the Ethics Committee directly.
                {isIndia && ' Under ICMR guidelines, all health data applications must have IEC oversight and approval.'}
              </p>
            </div>
          ) : (
            <p style={{ fontSize: 13, color: 'var(--wf-gray-500)', textAlign: 'center', padding: 12 }}>
              Ethics committee details are available once a hospital is selected.
            </p>
          )}
        </WireframeCard>
      )}

      {/* Data Retention Disclosure */}
      <button
        type="button"
        onClick={() => setShowRetention(!showRetention)}
        className="wf-list-item"
        style={{ background: 'white', borderRadius: '12px', marginBottom: '8px', width: '100%', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <div className="wf-icon-btn" style={{ background: '#fef3c7', color: '#d97706' }}>
          <Database size={20} />
        </div>
        <div className="wf-list-content">
          <div className="wf-list-title">Data Retention</div>
          <div className="wf-list-subtitle">How long we keep your data</div>
        </div>
        <ChevronRight size={18} style={{ color: 'var(--wf-gray-400)', transform: showRetention ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {showRetention && (
        <WireframeCard>
          <div style={{ fontSize: 13, color: 'var(--wf-gray-700)', lineHeight: 1.7 }}>
            {isIndia && (
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: 10, marginBottom: 12, fontSize: 12, color: '#92400e' }}>
                Under DPDPA 2023, we are required to disclose the purpose and duration of data retention for all personal data we process.
              </div>
            )}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '8px 6px', borderBottom: '2px solid #e5e7eb', fontSize: 12, color: '#6b7280' }}>Data Type</th>
                  <th style={{ textAlign: 'left', padding: '8px 6px', borderBottom: '2px solid #e5e7eb', fontSize: 12, color: '#6b7280' }}>Retention Period</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Account data', 'Until you delete your account'],
                  ['Health data', 'Until consent withdrawal or account deletion'],
                  ['Chat history', 'Up to 12 months, or until deletion request'],
                  ['Documents', 'Until you delete them or your account'],
                  ['Forum content', 'Until deleted; anonymised on account deletion'],
                  ['Consent records', 'Account duration + 3 years (audit)'],
                ].map(([type, period]) => (
                  <tr key={type}>
                    <td style={{ padding: '8px 6px', borderBottom: '1px solid #f3f4f6', fontWeight: 500 }}>{type}</td>
                    <td style={{ padding: '8px 6px', borderBottom: '1px solid #f3f4f6', color: 'var(--wf-gray-500)' }}>{period}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize: 12, color: 'var(--wf-gray-500)', marginTop: 10, lineHeight: 1.5 }}>
              Upon account deletion, personal data is removed within 30 days. Encrypted backups are purged within 90 days.
            </p>
          </div>
        </WireframeCard>
      )}

      {/* Nominee Designation — India only */}
      {isIndia && (
        <>
          <button
            type="button"
            onClick={() => setShowNominee(!showNominee)}
            className="wf-list-item"
            style={{ background: 'white', borderRadius: '12px', marginBottom: '8px', width: '100%', border: 'none', cursor: 'pointer', textAlign: 'left' }}
          >
            <div className="wf-icon-btn" style={{ background: '#dbeafe', color: '#2563eb' }}>
              <UserPlus size={20} />
            </div>
            <div className="wf-list-content">
              <div className="wf-list-title">Nominee Designation</div>
              <div className="wf-list-subtitle">DPDPA Section 14(3) — nominate a data rights representative</div>
            </div>
            <ChevronRight size={18} style={{ color: 'var(--wf-gray-400)', transform: showNominee ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>

          {showNominee && (
            <WireframeCard>
              <p style={{ fontSize: 13, color: 'var(--wf-gray-600)', marginBottom: 12, lineHeight: 1.5 }}>
                Under DPDPA Section 14(3), you may nominate a person to exercise your data rights in case of death or incapacity.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input
                  type="text"
                  className="wf-input"
                  placeholder="Nominee name"
                  value={nominee.name}
                  onChange={(e) => setNominee((prev: typeof nominee) => ({ ...prev, name: e.target.value }))}
                />
                <input
                  type="text"
                  className="wf-input"
                  placeholder="Relationship (e.g. spouse, parent, child)"
                  value={nominee.relationship}
                  onChange={(e) => setNominee((prev: typeof nominee) => ({ ...prev, relationship: e.target.value }))}
                />
                <input
                  type="email"
                  className="wf-input"
                  placeholder="Nominee email"
                  value={nominee.email}
                  onChange={(e) => setNominee((prev: typeof nominee) => ({ ...prev, email: e.target.value }))}
                />
                <input
                  type="tel"
                  className="wf-input"
                  placeholder="Nominee phone"
                  value={nominee.phone}
                  onChange={(e) => setNominee((prev: typeof nominee) => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              {nomineeError && (
                <p style={{ fontSize: 12, color: '#dc2626', marginTop: 8 }}>{nomineeError}</p>
              )}
              <button
                className="wf-btn"
                style={{ width: '100%', marginTop: 12, background: '#f43f5e', color: 'white', border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
                onClick={async () => {
                  setNomineeError('')
                  try {
                    await saveNominee(nominee)
                    localStorage.setItem('dpdpa_nominee', JSON.stringify(nominee))
                    setNomineeSaved(true)
                    setTimeout(() => setNomineeSaved(false), 2500)
                  } catch (err) {
                    console.error('[Profile] Nominee save failed:', err)
                    setNomineeError(err instanceof Error ? err.message : 'Failed to save nominee. Please try again.')
                  }
                }}
              >
                {nomineeSaved ? <><Check size={14} /> Saved</> : 'Save Nominee'}
              </button>
            </WireframeCard>
          )}
        </>
      )}

      {/* Grievance Redressal — India only */}
      {isIndia && (
        <>
          <button
            type="button"
            onClick={() => setShowGrievance(!showGrievance)}
            className="wf-list-item"
            style={{ background: 'white', borderRadius: '12px', marginBottom: '8px', width: '100%', border: 'none', cursor: 'pointer', textAlign: 'left' }}
          >
            <div className="wf-icon-btn" style={{ background: '#fef2f2', color: '#dc2626' }}>
              <AlertTriangle size={20} />
            </div>
            <div className="wf-list-content">
              <div className="wf-list-title">Grievance Redressal</div>
              <div className="wf-list-subtitle">Submit a complaint under DPDPA</div>
            </div>
            <ChevronRight size={18} style={{ color: 'var(--wf-gray-400)', transform: showGrievance ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>

          {showGrievance && (
            <WireframeCard>
              <div style={{ fontSize: 13, color: 'var(--wf-gray-700)', lineHeight: 1.7 }}>
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: 12, marginBottom: 12 }}>
                  <p style={{ fontWeight: 600, marginBottom: 4 }}>Grievance Officer</p>
                  <p>Name: <strong>Anvega Compliance Team</strong></p>
                  <p>Email: <a href="mailto:grievance@anvega.ai" style={{ color: '#2563eb' }}>grievance@anvega.ai</a></p>
                </div>
                <p style={{ fontSize: 12, color: 'var(--wf-gray-500)', marginBottom: 12 }}>
                  We will acknowledge your grievance within 48 hours and resolve it within 30 days, as required under DPDPA.
                </p>
                {grievanceSubmitted ? (
                  <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 8, padding: 14, textAlign: 'center' }}>
                    <Check size={20} style={{ color: '#059669', marginBottom: 6 }} />
                    <p style={{ fontWeight: 600, color: '#059669' }}>Grievance submitted successfully</p>
                    <p style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>You will receive an acknowledgement within 48 hours.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <input
                      type="text"
                      className="wf-input"
                      placeholder="Subject"
                      value={grievance.subject}
                      onChange={(e) => setGrievance((prev) => ({ ...prev, subject: e.target.value }))}
                    />
                    <textarea
                      className="wf-input"
                      placeholder="Describe your concern..."
                      rows={4}
                      value={grievance.description}
                      onChange={(e) => setGrievance((prev) => ({ ...prev, description: e.target.value }))}
                      style={{ resize: 'vertical' }}
                    />
                    <button
                      className="wf-btn"
                      style={{ width: '100%', background: '#f43f5e', color: 'white', border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 600, cursor: grievance.subject && grievance.description ? 'pointer' : 'not-allowed', opacity: grievance.subject && grievance.description ? 1 : 0.5 }}
                      disabled={!grievance.subject || !grievance.description}
                      onClick={async () => {
                        try {
                          const { submitGrievance } = await import('../../services/api')
                          await submitGrievance(grievance.subject, grievance.description)
                        } catch {
                          // Fallback: mailto
                          window.open(`mailto:grievance@anvega.ai?subject=${encodeURIComponent(grievance.subject)}&body=${encodeURIComponent(grievance.description)}`)
                        }
                        setGrievanceSubmitted(true)
                      }}
                    >
                      Submit Grievance
                    </button>
                    <p style={{ fontSize: 11, color: 'var(--wf-gray-400)', textAlign: 'center' }}>
                      You may also escalate to the <strong>Data Protection Board of India</strong> if unresolved.
                    </p>
                  </div>
                )}
              </div>
            </WireframeCard>
          )}
        </>
      )}

      {!showDeleteConfirm ? (
        <button
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          className="wf-list-item"
          style={{ background: 'white', borderRadius: '12px', marginBottom: '8px', width: '100%', border: 'none', cursor: 'pointer', textAlign: 'left' }}
        >
          <div className="wf-icon-btn" style={{ background: '#fee2e2', color: '#dc2626' }}>
            <Trash2 size={20} />
          </div>
          <div className="wf-list-content">
            <div className="wf-list-title" style={{ color: '#dc2626' }}>Delete my account</div>
            <div className="wf-list-subtitle">Permanently delete account and all data</div>
          </div>
        </button>
      ) : (
        <WireframeCard>
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <Trash2 size={28} style={{ color: '#dc2626', marginBottom: 8 }} />
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#dc2626', marginBottom: 8 }}>
              Delete your account?
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--wf-gray-600)', marginBottom: 16 }}>
              This will permanently delete all your data within 30 days. Forum posts will be anonymised.
              Type <strong>DELETE MY ACCOUNT</strong> to confirm.
            </p>
            {deleteError && (
              <p style={{ fontSize: 13, color: '#dc2626', marginBottom: 10 }}>{deleteError}</p>
            )}
            <input
              type="text"
              className="wf-input"
              placeholder="Type DELETE MY ACCOUNT"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              style={{ textAlign: 'center', marginBottom: 12 }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="wf-btn wf-btn-secondary"
                style={{ flex: 1 }}
                onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText('') }}
              >
                Cancel
              </button>
              <button
                className="wf-btn"
                style={{ flex: 1, background: '#dc2626', color: 'white', border: 'none', borderRadius: 12, padding: '12px', fontSize: 14, fontWeight: 600, cursor: deleteConfirmText === 'DELETE MY ACCOUNT' ? 'pointer' : 'not-allowed', opacity: deleteConfirmText === 'DELETE MY ACCOUNT' ? 1 : 0.5 }}
                disabled={deleteConfirmText !== 'DELETE MY ACCOUNT'}
                onClick={handleDeleteAccount}
              >
                Delete
              </button>
            </div>
          </div>
        </WireframeCard>
      )}

      {/* Logout */}
      <button
        type="button"
        onClick={() => {
          logout()
          window.location.replace('/')
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          width: '100%',
          padding: '14px 16px',
          marginTop: '16px',
          background: 'white',
          border: '1px solid #fee2e2',
          borderRadius: '12px',
          cursor: 'pointer',
          fontSize: '15px',
          fontWeight: 600,
          color: '#dc2626',
        }}
      >
        <LogOut size={20} />
        Log Out
      </button>

      <p style={{ 
        textAlign: 'center', 
        fontSize: '12px', 
        color: 'var(--wf-gray-400)', 
        marginTop: '24px' 
      }}>
        Tara v2.0.0 • Made with ❤️
      </p>
    </WireframeLayout>
  )
}
