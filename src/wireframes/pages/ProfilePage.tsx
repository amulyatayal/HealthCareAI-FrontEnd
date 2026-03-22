import { useState } from 'react'
import { FileText, Calendar, Settings, Bell, Shield, LogOut, ChevronRight, User, Compass, Share2, Download, Trash2, ToggleLeft, Check, Clock, Search, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { WireframeLayout } from '../WireframeLayout'
import { WireframeCard } from '../components'
import { useBasePath } from '../hooks/useBasePath'
import { useAuth } from '../../contexts/AuthContext'
import { getStoredDataConsent, saveDataConsent, clearDataConsent, type DataConsentChoices } from '../../components/gdpr/DataConsentScreen'

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

  const handleExportData = async () => {
    setExporting(true)
    try {
      // In production: call GET /api/v2/me/export and trigger download
      // For now, simulate with a timeout
      await new Promise((r) => setTimeout(r, 1500))
      setExported(true)
      setTimeout(() => setExported(false), 3000)
    } catch (err) {
      console.error('Export failed:', err)
    } finally {
      setExporting(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE MY ACCOUNT') return
    try {
      // In production: call DELETE /api/v2/me
      // Then clear localStorage and redirect
      localStorage.clear()
      window.location.href = '/'
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  const menuItems = [
    {
      icon: Compass,
      title: 'Treatment pathway',
      subtitle: 'Where you are in your journey',
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
      icon: Bell,
      title: 'Notifications',
      subtitle: 'Manage your alerts',
      to: `${base}/profile`,
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      subtitle: 'Data protection settings',
      to: `${base}/profile`,
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
          <div className="wf-list-subtitle">Export all your data (GDPR Art. 20)</div>
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
                window.location.reload()
              }}
            >
              Reset All
            </button>
          </div>
          <p style={{ fontSize: 11, color: 'var(--wf-gray-400)', marginTop: 8, textAlign: 'center' }}>
            "Reset All" clears all consent and shows the consent screen again.
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
            setActivityLog(data.activities)
          } catch {
            setActivityLog([
              { id: '1', type: 'consent_granted', description: 'Data processing consent granted (all categories)', timestamp: new Date().toISOString() },
              { id: '2', type: 'account_created', description: 'Account created', timestamp: new Date(Date.now() - 86400000).toISOString() },
            ])
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
