import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  RefreshCw, 
  Loader2, 
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { updatePostureApi } from '../services/api';
import confetti from 'canvas-confetti';

export default function PostureAssessment() {
  const { posture, setPosture } = useSecurity();
  const [formData, setFormData] = useState({
    mfa_enabled: posture.mfa_enabled ?? true,
    automated_backups: posture.automated_backups ?? true,
    firewall_active: posture.firewall_active ?? true,
    employee_training: posture.employee_training ?? false,
    incident_plan_exists: posture.incident_plan_exists ?? false,
    patch_management: posture.patch_management ?? true,
    network_segmentation: posture.network_segmentation ?? false,
    edr_installed: posture.edr_installed ?? true
  });
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const QUESTIONS = [
    { key: 'mfa_enabled', label: 'Multi-Factor Authentication (MFA)', desc: 'Enforced across all Microsoft 365 / Google Workspace & banking accounts', weight: '15%' },
    { key: 'automated_backups', label: 'Automated Offline Backups (3-2-1 Rule)', desc: 'Daily encrypted backups with immutable cloud retention or disconnected drive', weight: '15%' },
    { key: 'firewall_active', label: 'Active Stateful Perimeter Firewall', desc: 'Perimeter gateway firewall active and blocking non-essential ports (2053, 4444, 3389)', weight: '12%' },
    { key: 'patch_management', label: 'Automated OS & Application Patching', desc: 'Critical Windows/Linux security patches deployed within 72 hours of release', weight: '15%' },
    { key: 'employee_training', label: 'Quarterly Phishing & Quishing Drills', desc: 'Staff trained to spot fake QR invoices, urgent banking lures, and BEC impostors', weight: '13%' },
    { key: 'incident_plan_exists', label: 'Documented 1-Page Incident Response Plan', desc: 'Emergency response protocol aligned with CERT-In 6-hour disclosure directive', weight: '10%' },
    { key: 'network_segmentation', label: 'Guest Wi-Fi & IoT Device Segmentation', desc: 'Office accounting PCs isolated from guest Wi-Fi, CCTV, and smart office devices', weight: '10%' },
    { key: 'edr_installed', label: 'Endpoint Anti-Malware / EDR Protection', desc: 'Real-time antivirus or behavioral agent active across all employee laptops', weight: '10%' }
  ];

  const handleToggle = (key) => {
    setFormData(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveAudit = async () => {
    setSaving(true);
    try {
      const res = await updatePostureApi(formData);
      if (res.data?.data) {
        setPosture(res.data.data);
        setSavedSuccess(true);
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>NIST CSF 2.0 & CERT-In Posture Audit</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Evaluate and calibrate your enterprise cyber-defense readiness against national and global benchmarks.
          </p>
        </div>

        <button
          onClick={handleSaveAudit}
          disabled={saving}
          className="btn-cyber-primary"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          <span>{savedSuccess ? 'Posture Updated!' : 'Recalculate Security Score'}</span>
        </button>
      </div>

      {/* Score Overview Banner */}
      <div className="glass-panel" style={{
        padding: '20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(15, 23, 42, 0.8) 100%)'
      }}>
        <div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', fontWeight: 600 }}>OVERALL POSTURE SCORE</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38BDF8', marginTop: '2px' }}>
            {posture.score} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 100</span>
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', fontWeight: 600 }}>CYBER RESILIENCE GRADE</span>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: posture.score >= 70 ? '#34D399' : '#FBBF24', marginTop: '6px' }}>
            {posture.grade}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', fontWeight: 600 }}>IDENTIFY / PROTECT / DETECT</span>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px', fontSize: '0.75rem', fontWeight: 600 }}>
            <span style={{ color: '#38BDF8' }}>ID: {posture.nist_alignment?.IDENTIFY || 70}%</span> •
            <span style={{ color: '#34D399' }}>PR: {posture.nist_alignment?.PROTECT || 65}%</span> •
            <span style={{ color: '#A78BFA' }}>DE: {posture.nist_alignment?.DETECT || 80}%</span>
          </div>
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="glass-panel" style={{ padding: '22px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>Security Controls Checklist</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {QUESTIONS.map((q) => {
            const isChecked = formData[q.key];

            return (
              <div
                key={q.key}
                onClick={() => handleToggle(q.key)}
                style={{
                  padding: '14px 18px',
                  borderRadius: '10px',
                  background: isChecked ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                  border: `1px solid ${isChecked ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {isChecked ? (
                    <CheckCircle2 size={22} color="#10B981" />
                  ) : (
                    <XCircle size={22} color="#EF4444" />
                  )}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {q.label}
                      </span>
                      <span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(30, 41, 59, 0.8)', color: 'var(--text-subtle)' }}>
                        Weight {q.weight}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {q.desc}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: isChecked ? '#059669' : '#DC2626',
                    color: '#FFF',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {isChecked ? 'ENFORCED' : 'GAP DETECTED'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
