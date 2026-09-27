import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Wifi, 
  Building2, 
  LogOut, 
  User, 
  ChevronDown, 
  Sparkles,
  Shield
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';

export default function Navbar() {
  const { user, logout, posture, incidents, socketConnected } = useSecurity();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const openCriticals = incidents.filter(i => i.status === 'OPEN' && i.severity === 'CRITICAL').length;

  const roleLabelMap = {
    'BUSINESS_OWNER': 'Business Owner',
    'IT_SECURITY_LEAD': 'IT Security Lead',
    'FINANCE_ADMIN': 'Finance Lead'
  };

  return (
    <header style={{
      height: '68px',
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      {/* Brand logo & tagline */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(37, 99, 235, 0.5)'
        }}>
          <ShieldCheck size={22} color="#FFFFFF" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Biz<span style={{ color: '#38BDF8' }}>Raksha</span>
            </span>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '4px',
              background: 'rgba(59, 130, 246, 0.2)',
              color: '#60A5FA',
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}>CYPHER AI</span>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>AI-Powered CyberShield for MSMEs</p>
        </div>
      </div>

      {/* Center Status Pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid var(--border-color)',
          borderRadius: '20px'
        }}>
          <Wifi size={14} color={socketConnected ? '#10B981' : '#EF4444'} />
          <span style={{ fontSize: '0.78rem', color: socketConnected ? '#34D399' : '#F87171', fontWeight: 500 }}>
            {socketConnected ? 'Live Sensor Pipeline Active' : 'Sensor Reconnecting...'}
          </span>
        </div>

        {openCriticals > 0 ? (
          <div className="badge-critical pulse-danger" style={{ cursor: 'pointer' }}>
            <ShieldAlert size={14} />
            <span>{openCriticals} Critical Action{openCriticals > 1 ? 's' : ''} Needed</span>
          </div>
        ) : (
          <div className="badge-safe">
            <ShieldCheck size={14} />
            <span>Perimeter Secure</span>
          </div>
        )}
      </div>

      {/* Right User & Profile Dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
        <div style={{ textAlign: 'right', display: 'none', md: 'block' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
            <Building2 size={13} color="#94A3B8" />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>
              {user?.company || 'Enterprise MSME'}
            </span>
          </div>
          <span style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 500 }}>
            NIST Grade: {posture.grade?.split(' ')[0] || 'B'} ({posture.score}/100)
          </span>
        </div>

        {/* User Badge Clickable Dropdown */}
        <div
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 8px 4px 4px',
            borderRadius: '24px',
            background: 'rgba(30, 41, 59, 0.5)',
            border: '1px solid var(--border-color)',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.82rem'
          }}>
            {user?.avatar || 'US'}
          </div>
          <div style={{ textAlign: 'left', marginRight: '4px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.1 }}>
              {user?.name || 'Authorized User'}
            </div>
            <div style={{ fontSize: '0.65rem', color: '#38BDF8' }}>
              {roleLabelMap[user?.role] || 'Member'}
            </div>
          </div>
          <ChevronDown size={14} color="#94A3B8" />
        </div>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div 
            className="glass-panel"
            style={{
              position: 'absolute',
              right: 0,
              top: '52px',
              width: '240px',
              backgroundColor: '#0F172A',
              border: '1px solid var(--border-color)',
              padding: '12px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.7)',
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <div style={{ paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF' }}>{user?.name}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{user?.email}</div>
            </div>

            <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', padding: '4px 0' }}>
              Enterprise: <strong style={{ color: 'var(--text-main)' }}>{user?.company}</strong>
            </div>

            <button
              onClick={() => {
                setDropdownOpen(false);
                logout();
              }}
              className="btn-cyber-danger"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '8px',
                fontSize: '0.78rem',
                marginTop: '6px'
              }}
            >
              <LogOut size={14} />
              <span>Log Out (Secure Exit)</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
