import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  Zap, 
  Activity,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import PostureGauge from '../components/PostureGauge';
import BusinessRiskCard from '../components/BusinessRiskCard';
import ThreatTicker from '../components/ThreatTicker';
import OneClickActionModal from '../components/OneClickActionModal';

export default function Dashboard({ setActiveTab }) {
  const { incidents, posture } = useSecurity();
  const [selectedIncident, setSelectedIncident] = useState(null);

  const openIncidents = incidents.filter(i => i.status === 'OPEN');
  const criticalThreats = openIncidents.filter(i => i.severity === 'CRITICAL');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', padding: '24px' }}>
      {/* Top Banner / Executive Alert if Critical */}
      {criticalThreats.length > 0 && (
        <div className="glass-panel glass-panel-danger pulse-danger" style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.3)', color: '#F87171' }}>
              <ShieldAlert size={26} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge-critical">ACTION REQUIRED</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF' }}>
                  {criticalThreats[0].title}
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#FCA5A5', marginTop: '3px' }}>
                {criticalThreats[0].bluf}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedIncident(criticalThreats[0])}
            className="btn-cyber-danger"
            style={{ whiteSpace: 'nowrap', fontSize: '0.85rem' }}
          >
            <Zap size={16} />
            <span>1-Click Contain Threat</span>
          </button>
        </div>
      )}

      {/* Business Risk KPI Cards */}
      <BusinessRiskCard incidents={incidents} />

      {/* Center Grid: Posture Gauge & Threat Ticker */}
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '20px' }}>
        <PostureGauge
          score={posture.score}
          grade={posture.grade}
          onAuditClick={() => setActiveTab('posture')}
        />

        <ThreatTicker />
      </div>

      {/* Bottom Section: Active Threat Actions & Quick Launch Tools */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px' }}>
        {/* Active Threats Table */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Priority Threats Queue</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Real-time business risk items requiring review</p>
            </div>
            <button
              onClick={() => setActiveTab('incidents')}
              className="btn-cyber-outline"
              style={{ fontSize: '0.75rem', padding: '5px 10px' }}
            >
              View All ({incidents.length})
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {openIncidents.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#34D399' }}>
                <CheckCircle size={32} style={{ margin: '0 auto 8px auto' }} />
                <div style={{ fontWeight: 600 }}>All Identified Threats Contained!</div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Continuous AI sensors are actively monitoring all endpoints.</p>
              </div>
            ) : (
              openIncidents.slice(0, 3).map((inc) => (
                <div
                  key={inc.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={inc.severity === 'CRITICAL' ? 'badge-critical' : 'badge-high'}>
                        {inc.severity}
                      </span>
                      <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {inc.title}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Target: <span style={{ color: '#38BDF8', fontFamily: 'var(--font-mono)' }}>{inc.target_asset}</span> • Loss: {inc.business_impact?.financial_exposure || '₹3,00,000+'}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedIncident(inc)}
                    className={inc.severity === 'CRITICAL' ? 'btn-cyber-danger' : 'btn-cyber-primary'}
                    style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                  >
                    Take Action
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Fast Scanner Launchpad */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Sparkles size={18} color="#38BDF8" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>AI Security Tool Suite</h3>
            </div>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-subtle)', marginBottom: '16px' }}>
              Specialized detectors built for MSME threat scenarios
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div 
                onClick={() => setActiveTab('scanner')}
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'rgba(30, 41, 59, 0.4)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#38BDF8' }}>Dual-Module QR / Quishing Scanner</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Detects gateway evasion and fraudulent payment QR codes</div>
                </div>
                <ArrowRight size={16} color="#94A3B8" />
              </div>

              <div 
                onClick={() => setActiveTab('translator')}
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'rgba(30, 41, 59, 0.4)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#A78BFA' }}>Executive BLUF Risk Translator</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Converts technical CVEs and IOCs into plain-English briefings</div>
                </div>
                <ArrowRight size={16} color="#94A3B8" />
              </div>

              <div 
                onClick={() => setActiveTab('reports')}
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'rgba(30, 41, 59, 0.4)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#34D399' }}>CERT-In Compliance Export</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Generate ready-to-file incident reports under Indian regulations</div>
                </div>
                <ArrowRight size={16} color="#94A3B8" />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '14px', fontSize: '0.72rem', color: 'var(--text-subtle)', textAlign: 'center' }}>
            BizRaksha v1.0 • Cypher AI Multi-Layer Engine
          </div>
        </div>
      </div>

      {/* One-Click Action Modal */}
      {selectedIncident && (
        <OneClickActionModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}
    </div>
  );
}
