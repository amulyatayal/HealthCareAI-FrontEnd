import { Link } from 'react-router-dom';
import { FolderOpen, Share2, KeyRound } from 'lucide-react';

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
    title: 'Shared Patient Data',
    description: 'View data that patients have shared with your clinical team.',
    icon: Share2,
    iconBg: 'linear-gradient(135deg, var(--lavender-100), var(--lavender-50))',
    iconColor: 'var(--lavender-300)',
    path: '/admin/shared-data',
    enabled: false,
  },
  {
    title: 'Access Codes',
    description: 'Manage access codes that can be shared with patients to connect them to your team.',
    icon: KeyRound,
    iconBg: 'linear-gradient(135deg, var(--rose-100), var(--rose-50))',
    iconColor: 'var(--rose-400)',
    path: '/admin/access-codes',
    enabled: false,
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
