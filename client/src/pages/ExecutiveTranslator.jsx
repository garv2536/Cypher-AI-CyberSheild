import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, DollarSign, Clock, AlertOctagon, Loader2, Copy } from 'lucide-react';
import { translateBLUFApi } from '../services/api';

export default function ExecutiveTranslator() {
  const [title, setTitle] = useState('Critical RCE Vulnerability in Corporate VPN Gateway (CVE-2024-3400)');
  const [threatType, setThreatType] = useState('ransomware');
  const [severity, setSeverity] = useState('CRITICAL');
  const [targetAsset, setTargetAsset] = useState('Perimeter Edge Firewall & Internal File Server');
  const [sourceIp, setSourceIp] = useState('185.220.101.5 (Known LockBit Affiliate Infrastructure)');
  const [rawDetails, setRawDetails] = useState('Command injection via arbitrary file creation. Threat actor executing living-off-the-land PowerShell scripts and staging data exfiltration on port 8443.');
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTranslate = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const res = await translateBLUFApi({
        title,
        threat_type: threatType,
        severity,
        target_asset: targetAsset,
        source_ip: sourceIp,
        raw_details: rawDetails
      });
      setResult(res.data?.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', padding: '24px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={22} color="#A78BFA" />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Executive BLUF Risk Translator</h2>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Converts raw technical telemetry, CVE advisories, and EDR logs into executive decision-ready risk briefings (Aguilar 2026 Minto-Pyramid Architecture).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '22px' }}>
        {/* Left Input Form */}
        <div className="glass-panel" style={{ padding: '22px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px' }}>Technical Threat Input</h3>

          <form onSubmit={handleTranslate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Threat Title / CVE:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: '#0B0F19', color: '#FFF', fontSize: '0.82rem', marginTop: '4px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Threat Category:</label>
                <select
                  value={threatType}
                  onChange={(e) => setThreatType(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: '#0B0F19', color: '#FFF', fontSize: '0.82rem', marginTop: '4px' }}
                >
                  <option value="ransomware">Ransomware Infiltration</option>
                  <option value="phishing">Credential Phishing / AiTM</option>
                  <option value="exfiltration">Data Exfiltration / C2</option>
                  <option value="vulnerability">Unpatched CVE Vulnerability</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Severity:</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: '#0B0F19', color: '#FFF', fontSize: '0.82rem', marginTop: '4px' }}
                >
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Target Asset:</label>
              <input
                type="text"
                value={targetAsset}
                onChange={(e) => setTargetAsset(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: '#0B0F19', color: '#FFF', fontSize: '0.82rem', marginTop: '4px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Technical Telemetry / Details:</label>
              <textarea
                rows={4}
                value={rawDetails}
                onChange={(e) => setRawDetails(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: '#0B0F19', color: '#FFF', fontSize: '0.82rem', marginTop: '4px' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-cyber-primary"
              style={{ justifyContent: 'center', marginTop: '4px' }}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              <span>Generate Executive Briefing</span>
            </button>
          </form>
        </div>

        {/* Right Output Form */}
        <div className="glass-panel" style={{ padding: '22px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px' }}>Executive Decision-Ready Output</h3>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 12px auto' }} />
              <div>Translating technical indicators into business impact and 1-click directives...</div>
            </div>
          ) : result ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Section 1: BLUF */}
              <div style={{
                padding: '14px',
                borderRadius: '8px',
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.4)'
              }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#FBBF24', textTransform: 'uppercase' }}>
                  1. Bottom Line Up Front (BLUF):
                </span>
                <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#FFFFFF', marginTop: '4px', lineHeight: 1.4 }}>
                  {result.bluf}
                </p>
              </div>

              {/* Section 2: Potential Business Impact */}
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#38BDF8', textTransform: 'uppercase' }}>
                  2. Potential Business & Financial Impact:
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '8px', fontSize: '0.78rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-subtle)' }}>Financial Exposure:</span>
                    <div style={{ fontWeight: 700, color: '#F87171', marginTop: '2px' }}>{result.business_impact?.financial_exposure}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-subtle)' }}>Operational Downtime:</span>
                    <div style={{ fontWeight: 700, color: '#FBBF24', marginTop: '2px' }}>{result.business_impact?.operational_downtime}</div>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <span style={{ color: 'var(--text-subtle)' }}>Regulatory & Compliance:</span>
                    <div style={{ color: 'var(--text-main)', marginTop: '2px' }}>{result.business_impact?.regulatory_risk}</div>
                  </div>
                </div>
              </div>

              {/* Section 3: Affected Systems / Scope */}
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.78rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#A78BFA', textTransform: 'uppercase' }}>
                  3. Affected Systems / Business Scope:
                </span>
                <p style={{ color: 'var(--text-main)', marginTop: '4px' }}>{result.affected_scope}</p>
              </div>

              {/* Section 4: Recommended Actions */}
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#34D399', textTransform: 'uppercase' }}>
                  4. Prioritized Recommended Actions:
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px', fontSize: '0.76rem' }}>
                  {result.prioritized_actions?.map((act, i) => (
                    <div key={i} style={{ padding: '8px', borderRadius: '6px', background: 'rgba(30, 41, 59, 0.5)', borderLeft: '3px solid #10B981' }}>
                      <span style={{ fontWeight: 700, color: '#34D399' }}>[{act.role}]</span> {act.directive}
                      <div style={{ color: 'var(--text-subtle)', fontSize: '0.7rem', marginTop: '2px' }}>↳ Rationale: {act.rationale}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-subtle)', fontSize: '0.85rem' }}>
              Click "Generate Executive Briefing" to translate the technical alert.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
