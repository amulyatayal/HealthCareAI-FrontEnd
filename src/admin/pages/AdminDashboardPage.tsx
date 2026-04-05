import { Link } from 'react-router-dom';
import { FolderOpen, Share2, KeyRound, MessageSquare, Calendar, Bell } from 'lucide-react';

const CARDS = [
  {
    title: 'Pathway Resources',
    description: 'Associate PDF leaflets, video links, and other resources with treatment pathway stages and clinical intents.',
    icon: FolderOpen,
    iconBg: 'linear-gradient(135deg, var(--sage-100), var(--sage-50))',
    iconColor: 'var(--sage-500)',
    path: '/admin/resources',
    enabled: true,
  },
  {
    title: 'Access Codes',
    description: 'Manage access codes that can be shared with patients to connect them to your team.',
    icon: KeyRound,
    iconBg: 'linear-gradient(135deg, var(--rose-100), var(--rose-50))',
    iconColor: 'var(--rose-400)',
    path: '/admin/access-codes',
    enabled: true,
  },
  {
    title: 'Community Chats',
    description: 'Moderate community chat rooms and engage with patients as a care team member.',
    icon: MessageSquare,
    iconBg: 'linear-gradient(135deg, #e8f5e9, #f1f8e9)',
    iconColor: '#43a047',
    path: '/admin/community',
    enabled: true,
  },
  {
    title: 'Events',
    description: 'Create and manage wellness events, support groups, and educational sessions.',
    icon: Calendar,
    iconBg: 'linear-gradient(135deg, #fff3e0, #fff8e1)',
    iconColor: '#ef6c00',
    path: '/admin/events',
    enabled: true,
  },
  {
    title: 'Notifications',
    description: 'Send announcements and alerts to all patients connected to your team.',
    icon: Bell,
    iconBg: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
    iconColor: '#1565c0',
    path: '/admin/notifications',
    enabled: true,
  },
  {
    title: 'Shared Patient Data',
    description: 'View data that patients have shared with your clinical team.',
    icon: Share2,
    iconBg: 'linear-gradient(135deg, var(--lavender-100), var(--lavender-50))',
    iconColor: 'var(--lavender-300)',
    path: '/admin/shared-data',
    enabled: true,
  },
];

export function AdminDashboardPage() {
  return (
    <>
      <div className="admin-page-header">
        <h1>Dashboard</h1>
        <p>Welcome to the Tara clinician admin portal.</p>
      </div>

      <div className="admin-dashboard-grid">
        {CARDS.map((card) => {
          const inner = (
            <>
              <div className="admin-dash-card-icon" style={{ background: card.iconBg }}>
                <card.icon size={22} color={card.iconColor} />
              </div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              {!card.enabled && <span className="admin-dash-card-badge">Coming soon</span>}
            </>
          );

          return card.enabled ? (
            <Link key={card.path} to={card.path} className="admin-dash-card">
              {inner}
            </Link>
          ) : (
            <div key={card.path} className="admin-dash-card disabled">
              {inner}
            </div>
          );
        })}
      </div>
    </>
  );
}
