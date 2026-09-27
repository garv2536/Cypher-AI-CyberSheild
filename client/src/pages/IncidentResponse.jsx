import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, Zap, Lock, Filter, CheckCircle2, Clock } from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import OneClickActionModal from '../components/OneClickActionModal';

export default function IncidentResponse() {
  const { incidents } = useSecurity();
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [filter, setFilter] = useState('ALL');

  const filteredIncidents = incidents.filter(i => {
    if (filter === 'OPEN') return i.status === 'OPEN';
    if (filter === 'CONTAINED') return i.status === 'CONTAINED';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Incident Response & 1-Click Action Hub</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Review flagged security incidents, assess business exposure, and execute one-click containment.
          </p>
        </div>

        {/* Filter buttons */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {['ALL', 'OPEN', 'CONTAINED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={filter === f ? 'btn-cyber-primary' : 'btn-cyber-outline'}
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredIncidents.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-subtle)' }}>
            No incidents found for current filter.
          </div>
        ) : (
          filteredIncidents.map((inc) => {
            const isCrit = inc.severity === 'CRITICAL';
            const isOpen = inc.status === 'OPEN';

            return (
              <div
                key={inc.id}
                className="glass-panel"
                style={{
                  padding: '20px',
                  borderLeft: `4px solid ${isCrit ? '#EF4444' : (isOpen ? '#F59E0B' : '#10B981')}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className={isCrit ? 'badge-critical' : 'badge-high'}>
                        {inc.severity}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-subtle)' }}>
                        {inc.id}
                      </span>
                      <span className={isOpen ? 'badge-high' : 'badge-safe'} style={{ fontSize: '0.7rem' }}>
                        {inc.status}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '6px' }}>
                      {inc.title}
                    </h3>
                  </div>

                  {isOpen ? (
                    <button
                      onClick={() => setSelectedIncident(inc)}
                      className="btn-cyber-danger"
                      style={{ fontSize: '0.8rem', padding: '8px 14px' }}
                    >
                      <Zap size={15} />
                      <span>Take Action</span>
                    </button>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34D399', fontSize: '0.8rem', fontWeight: 600 }}>
                      <CheckCircle2 size={16} />
                      <span>Contained</span>
                    </div>
                  )}
                </div>

                {/* BLUF Summary */}
                <div style={{
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.82rem'
                }}>
                  <span style={{ color: '#FBBF24', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>
                    Executive BLUF:
                  </span>
                  <p style={{ color: 'var(--text-main)', marginTop: '2px', lineHeight: 1.4 }}>
                    {inc.bluf}
                  </p>
                </div>

                {/* Grid of Business Context */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '0.75rem' }}>
                  <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '8px 12px', borderRadius: '6px' }}>
                    <span style={{ color: 'var(--text-subtle)' }}>Targeted Asset:</span>
                    <div style={{ fontWeight: 600, color: '#38BDF8', marginTop: '2px' }}>{inc.target_asset}</div>
                  </div>

                  <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '8px 12px', borderRadius: '6px' }}>
                    <span style={{ color: 'var(--text-subtle)' }}>Financial Exposure:</span>
                    <div style={{ fontWeight: 600, color: '#F87171', marginTop: '2px' }}>{inc.business_impact?.financial_exposure || '₹5,00,000+'}</div>
                  </div>

                  <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '8px 12px', borderRadius: '6px' }}>
                    <span style={{ color: 'var(--text-subtle)' }}>Regulatory Notice:</span>
                    <div style={{ fontWeight: 600, color: '#A78BFA', marginTop: '2px' }}>{inc.business_impact?.regulatory_risk || 'CERT-In SLA'}</div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {selectedIncident && (
        <OneClickActionModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}
    </div>
  );
}
