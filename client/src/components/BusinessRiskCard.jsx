import React from 'react';
import { DollarSign, Clock, ShieldAlert, FileCheck2, IndianRupee } from 'lucide-react';

export default function BusinessRiskCard({ incidents = [] }) {
  const openIncidents = incidents.filter(i => i.status === 'OPEN');
  const criticalCount = openIncidents.filter(i => i.severity === 'CRITICAL').length;
  const resolvedCount = incidents.filter(i => i.status === 'CONTAINED').length;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
      {/* Metric 1: Financial Exposure */}
      <div className="glass-panel" style={{ padding: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 600 }}>FINANCIAL EXPOSURE AT RISK</span>
          <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', color: '#F87171' }}>
            <IndianRupee size={18} />
          </div>
        </div>
        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: criticalCount > 0 ? '#F87171' : '#10B981' }}>
          {criticalCount > 0 ? '₹8,50,000' : '₹0 (Safe)'}
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
          Estimated potential breach loss across active open alerts
        </p>
      </div>

      {/* Metric 2: Potential Operational Downtime */}
      <div className="glass-panel" style={{ padding: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 600 }}>ESTIMATED DOWNTIME</span>
          <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24' }}>
            <Clock size={18} />
          </div>
        </div>
        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: criticalCount > 0 ? '#FBBF24' : '#10B981' }}>
          {criticalCount > 0 ? '4 - 12 Hours' : '0 Hours'}
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
          Accounting & Sales system freeze if uncontained
        </p>
      </div>

      {/* Metric 3: Active Threat Containment */}
      <div className="glass-panel" style={{ padding: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 600 }}>CONTAINED INCIDENTS</span>
          <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399' }}>
            <FileCheck2 size={18} />
          </div>
        </div>
        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34D399' }}>
          {resolvedCount} Threats
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
          Neutralized via automated 1-click remediation
        </p>
      </div>

      {/* Metric 4: Compliance Status */}
      <div className="glass-panel" style={{ padding: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 600 }}>CERT-IN / DPDP STATUS</span>
          <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA' }}>
            <ShieldAlert size={18} />
          </div>
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: criticalCount > 0 ? '#FBBF24' : '#38BDF8', marginTop: '4px' }}>
          {criticalCount > 0 ? 'Action Required' : 'Audit Ready'}
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
          Incident logs preserved for mandatory regulatory timelines
        </p>
      </div>
    </div>
  );
}
