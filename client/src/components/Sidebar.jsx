import React from 'react';
import { 
  LayoutDashboard, 
  Radar, 
  AlertTriangle, 
  Sparkles, 
  ClipboardCheck, 
  FileText,
  Shield,
  HelpCircle
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { incidents } = useSecurity();
  const openIncidentCount = incidents.filter(i => i.status === 'OPEN').length;

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'scanner', label: 'AI Threat Scanner', icon: Radar },
    { 
      id: 'incidents', 
      label: 'Active Incident Hub', 
      icon: AlertTriangle,
      badge: openIncidentCount > 0 ? openIncidentCount : null,
      badgeColor: 'danger'
    },
    { id: 'translator', label: 'Executive BLUF AI', icon: Sparkles },
    { id: 'posture', label: 'NIST CSF 2.0 Audit', icon: ClipboardCheck },
    { id: 'reports', label: 'Compliance Reports', icon: FileText }
  ];

  return (
    <aside style={{
      width: '240px',
      backgroundColor: 'rgba(11, 15, 25, 0.95)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '20px 14px',
      minHeight: 'calc(100vh - 68px)'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ padding: '0 10px 10px 10px', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Navigation & Controls
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '11px 14px',
                borderRadius: '10px',
                border: 'none',
                background: isActive 
                  ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.25) 0%, rgba(6, 182, 212, 0.15) 100%)' 
                  : 'transparent',
                color: isActive ? '#38BDF8' : 'var(--text-muted)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.86rem',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                textAlign: 'left',
                borderLeft: isActive ? '3px solid #38BDF8' : '3px solid transparent'
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.4)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon size={18} color={isActive ? '#38BDF8' : '#94A3B8'} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span style={{
                  padding: '2px 7px',
                  borderRadius: '9999px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  background: 'rgba(239, 68, 68, 0.25)',
                  color: '#F87171',
                  border: '1px solid rgba(239, 68, 68, 0.5)'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* MSME Cyber-Help Widget */}
      <div className="glass-panel" style={{ padding: '14px', marginTop: '20px', background: 'rgba(15, 23, 42, 0.6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Shield size={16} color="#10B981" />
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#34D399' }}>CERT-In 6-Hour SLA</span>
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', lineHeight: 1.4 }}>
          BizRaksha automates breach logging to ensure compliance with Indian Cyber Directives.
        </p>
      </div>
    </aside>
  );
}
