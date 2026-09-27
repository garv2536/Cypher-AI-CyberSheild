import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, Lock, Ban, UserX, Loader2 } from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import confetti from 'canvas-confetti';

export default function OneClickActionModal({ incident, onClose }) {
  const { remediateIncident } = useSecurity();
  const [executing, setExecuting] = useState(false);
  const [completed, setCompleted] = useState(false);

  if (!incident) return null;

  const handleAction = async (actionType) => {
    setExecuting(true);
    const res = await remediateIncident(incident.id, actionType);
    setExecuting(false);
    if (res?.success) {
      setCompleted(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
      setTimeout(() => {
        onClose();
      }, 1800);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '560px',
        width: '100%',
        padding: '28px',
        backgroundColor: '#0F172A',
        border: '1px solid rgba(239, 68, 68, 0.4)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)'
      }}>
        {completed ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircle2 size={54} color="#10B981" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34D399' }}>Threat Contained!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '8px' }}>
              One-click security directive sent. Target asset protected and perimeter firewall updated.
            </p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.2)', color: '#F87171' }}>
                <ShieldAlert size={24} />
              </div>
              <div>
                <span className="badge-critical" style={{ marginBottom: '4px' }}>CRITICAL EXECUTIVE ACTION</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{incident.title}</h3>
              </div>
            </div>

            {/* BLUF Box */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.9)',
              borderLeft: '4px solid #F59E0B',
              padding: '14px',
              borderRadius: '6px',
              marginBottom: '18px'
            }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#FBBF24', textTransform: 'uppercase' }}>
                Bottom Line Up Front (BLUF):
              </span>
              <p style={{ fontSize: '0.85rem', color: '#F1F5F9', marginTop: '4px', lineHeight: 1.4 }}>
                {incident.bluf}
              </p>
            </div>

            {/* Impact Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '22px', fontSize: '0.78rem' }}>
              <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '10px', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-subtle)' }}>Target Asset:</span>
                <div style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>{incident.target_asset}</div>
              </div>
              <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '10px', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-subtle)' }}>Financial Exposure:</span>
                <div style={{ fontWeight: 600, color: '#F87171', marginTop: '2px' }}>{incident.business_impact?.financial_exposure || '₹5,00,000+'}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => handleAction('ISOLATE_HOST_AND_BLOCK_IP')}
                disabled={executing}
                className="btn-cyber-danger"
                style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
              >
                {executing ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
                <span>1-Click Auto Containment (Isolate Asset & Block Source IP)</span>
              </button>

              <button
                onClick={() => handleAction('REVOKE_ALL_OAUTH_SESSIONS')}
                disabled={executing}
                className="btn-cyber-outline"
                style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '0.82rem' }}
              >
                <UserX size={16} />
                <span>Revoke M365/Google Active Tokens Only</span>
              </button>

              <button
                onClick={onClose}
                disabled={executing}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-subtle)',
                  fontSize: '0.78rem',
                  padding: '8px',
                  cursor: 'pointer',
                  marginTop: '4px'
                }}
              >
                Dismiss / Review Technical Logs First
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
