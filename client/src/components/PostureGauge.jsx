import React from 'react';
import { ShieldCheck, ShieldAlert, Award } from 'lucide-react';

export default function PostureGauge({ score = 67, grade = 'B', onAuditClick }) {
  // SVG circular arc math
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = '#EF4444'; // Red
  if (score >= 80) color = '#10B981'; // Green
  else if (score >= 60) color = '#F59E0B'; // Gold
  else if (score >= 40) color = '#3B82F6'; // Blue

  return (
    <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '14px' }}>
        <div>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
            NIST CSF 2.0 Security Posture
          </span>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '2px' }}>Cyber-Resilience Index</h3>
        </div>
        <button 
          onClick={onAuditClick}
          className="btn-cyber-outline" 
          style={{ fontSize: '0.75rem', padding: '5px 10px' }}
        >
          Run Audit
        </button>
      </div>

      <div style={{ position: 'relative', width: '180px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="180" height="180" viewBox="0 0 180 180" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="transparent"
            stroke="rgba(30, 41, 59, 0.8)"
            strokeWidth="12"
          />
          {/* Progress circle */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
          />
        </svg>

        {/* Center content */}
        <div style={{ position: 'absolute', textAlign: 'center' }}>
          <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.03em' }}>
            {score}
          </span>
          <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/100</span>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: color,
            marginTop: '2px',
            textTransform: 'uppercase'
          }}>
            Grade {grade?.split(' ')[0] || 'B'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginTop: '16px', width: '100%', justifyContent: 'space-around', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)' }}>Status</span>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: color }}>
            {score >= 70 ? 'Defended' : 'Gaps Detected'}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)' }}>Framework</span>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#38BDF8' }}>
            NIST CSF 2.0
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)' }}>MSME Standard</span>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#A78BFA' }}>
            CERT-In
          </div>
        </div>
      </div>
    </div>
  );
}
