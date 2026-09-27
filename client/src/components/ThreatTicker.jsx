import React from 'react';
import { Activity, ShieldCheck, AlertCircle, Radio } from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';

export default function ThreatTicker() {
  const { liveTelemetry } = useSecurity();

  return (
    <div className="glass-panel" style={{ padding: '18px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Radio size={16} color="#38BDF8" className="pulse-danger" />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Live Sensor Feed & Telemetry</h3>
        </div>
        <span style={{ fontSize: '0.7rem', color: '#10B981', fontFamily: 'var(--font-mono)' }}>
          ● STREAMING
        </span>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        maxHeight: '260px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        paddingRight: '4px'
      }}>
        {liveTelemetry.length === 0 ? (
          <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-subtle)', fontSize: '0.8rem' }}>
            Listening for network and email sensor telemetry...
          </div>
        ) : (
          liveTelemetry.map((evt) => {
            const isCrit = evt.severity === 'CRITICAL';
            const isHigh = evt.severity === 'HIGH';
            const isMed = evt.severity === 'MEDIUM';

            let badgeClass = 'badge-safe';
            if (isCrit) badgeClass = 'badge-critical';
            else if (isHigh || isMed) badgeClass = 'badge-high';

            return (
              <div
                key={evt.id}
                style={{
                  padding: '9px 12px',
                  borderRadius: '8px',
                  background: isCrit ? 'rgba(239, 68, 68, 0.08)' : 'rgba(15, 23, 42, 0.4)',
                  border: isCrit ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(51, 65, 85, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  fontSize: '0.78rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className={badgeClass} style={{ fontSize: '0.65rem' }}>
                    {evt.severity}
                  </span>
                  <span style={{ color: isCrit ? '#FCA5A5' : 'var(--text-main)', fontWeight: isCrit ? 600 : 400 }}>
                    {evt.message}
                  </span>
                </div>
                <div style={{ textAlign: 'right', whiteSpace: 'nowrap', color: 'var(--text-subtle)', fontSize: '0.68rem', fontFamily: 'var(--font-mono)' }}>
                  {new Date(evt.timestamp).toLocaleTimeString()}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
