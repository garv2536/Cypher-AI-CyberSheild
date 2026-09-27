import React, { useState } from 'react';
import { 
  Globe, 
  QrCode, 
  Mail, 
  Network, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Loader2, 
  CheckCircle2, 
  Copy,
  Zap
} from 'lucide-react';
import { scanUrlApi, scanQRApi, scanEmailApi, scanNetworkLogsApi } from '../services/api';

export default function ThreatScanner() {
  const [activeTab, setActiveTab] = useState('url');

  // URL State
  const [urlInput, setUrlInput] = useState('');
  const [urlResult, setUrlResult] = useState(null);
  const [urlLoading, setUrlLoading] = useState(false);

  // QR State
  const [qrInput, setQrInput] = useState('https://gst-tax-invoicing-portal.xyz/verify');
  const [isDualModuleSim, setIsDualModuleSim] = useState(true);
  const [qrResult, setQrResult] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);

  // Email State
  const [emailSubject, setEmailSubject] = useState('URGENT: Outstanding GST Tax Invoice #8912 - Final Notice Before Bank Freeze');
  const [emailSender, setEmailSender] = useState('billing-department@gstin-online-verification.xyz');
  const [emailBody, setEmailBody] = useState('Dear Accounts Team,\n\nYour GSTIN registration will be suspended within 6 hours due to unpaid compliance penalty. Please immediately verify your corporate bank login credentials at https://gst-tax-invoicing-portal.xyz/verify to prevent legal freezing of accounts.\n\nRegards,\nTax Assessment Officer');
  const [emailResult, setEmailResult] = useState(null);
  const [emailLoading, setEmailLoading] = useState(false);

  // Log State
  const [logResult, setLogResult] = useState(null);
  const [logLoading, setLogLoading] = useState(false);

  // Handlers
  const handleUrlScan = async (e) => {
    e?.preventDefault();
    if (!urlInput.trim()) return;
    setUrlLoading(true);
    try {
      const res = await scanUrlApi(urlInput.trim());
      setUrlResult(res.data?.data);
    } catch (err) {
      console.error(err);
    } finally {
      setUrlLoading(false);
    }
  };

  const handleQRScan = async (e) => {
    e?.preventDefault();
    if (!qrInput.trim()) return;
    setQrLoading(true);
    try {
      const res = await scanQRApi(qrInput.trim(), {
        submodule_detected: isDualModuleSim,
        pixel_variance: isDualModuleSim ? 0.34 : 0.04,
        module_size: 29,
        submodule_size: isDualModuleSim ? 3 : 0
      });
      setQrResult(res.data?.data);
    } catch (err) {
      console.error(err);
    } finally {
      setQrLoading(false);
    }
  };

  const handleEmailScan = async (e) => {
    e?.preventDefault();
    setEmailLoading(true);
    try {
      const res = await scanEmailApi({
        subject: emailSubject,
        sender: emailSender,
        body: emailBody
      });
      setEmailResult(res.data?.data);
    } catch (err) {
      console.error(err);
    } finally {
      setEmailLoading(false);
    }
  };

  const handleLogScan = async () => {
    setLogLoading(true);
    try {
      const res = await scanNetworkLogsApi();
      setLogResult(res.data?.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLogLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', padding: '24px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>AI Multi-Modal Threat Scanner</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Real-time heuristic & machine learning inspection for phishing URLs, Quishing barcodes, BEC emails, and network flow anomalies.
        </p>
      </div>

      {/* Mode Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
        {[
          { id: 'url', label: 'URL / Domain Phishing', icon: Globe },
          { id: 'qr', label: 'Quishing & Dual-Module QR', icon: QrCode },
          { id: 'email', label: 'Email / BEC Inspector', icon: Mail },
          { id: 'network', label: 'Isolation Forest Flow NIDS', icon: Network }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 16px',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' : 'rgba(30, 41, 59, 0.4)',
                color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: URL Scanner */}
      {activeTab === 'url' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '22px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>Scan Website or Domain</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginBottom: '16px' }}>
              Extracts lexical entropy, subdomain depth, suspicious TLDs, and credentials harvesting keywords.
            </p>

            <form onSubmit={handleUrlScan} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Target URL / Link:
                </label>
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="e.g. http://194.26.29.112/secure-login-hdfc-kyc.xyz/auth"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: '#0B0F19',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              {/* Sample quick buttons */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', alignSelf: 'center' }}>Samples:</span>
                <button
                  type="button"
                  onClick={() => setUrlInput('http://194.26.29.112/portal-gst-verify-tax.xyz')}
                  className="btn-cyber-outline"
                  style={{ fontSize: '0.7rem', padding: '4px 8px' }}
                >
                  Fake GST Portal
                </button>
                <button
                  type="button"
                  onClick={() => setUrlInput('https://sbi-banking-kyc-update-portal.top/auth')}
                  className="btn-cyber-outline"
                  style={{ fontSize: '0.7rem', padding: '4px 8px' }}
                >
                  Phishing Bank KYC
                </button>
                <button
                  type="button"
                  onClick={() => setUrlInput('https://microsoft.com/en-us/security')}
                  className="btn-cyber-outline"
                  style={{ fontSize: '0.7rem', padding: '4px 8px' }}
                >
                  Legitimate Domain
                </button>
              </div>

              <button
                type="submit"
                disabled={urlLoading}
                className="btn-cyber-primary"
                style={{ justifyContent: 'center', marginTop: '8px' }}
              >
                {urlLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                <span>Run AI Phishing Analysis</span>
              </button>
            </form>
          </div>

          {/* Results Panel */}
          <div className="glass-panel" style={{ padding: '22px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px' }}>AI Scan Verdict</h3>
            {urlLoading ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 10px auto' }} />
                <div>Analyzing lexical patterns and domain reputation...</div>
              </div>
            ) : urlResult ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{
                  padding: '14px',
                  borderRadius: '10px',
                  background: urlResult.verdict === 'MALICIOUS' ? 'rgba(239, 68, 68, 0.15)' : (urlResult.verdict === 'SUSPICIOUS' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)'),
                  border: `1px solid ${urlResult.verdict === 'MALICIOUS' ? 'rgba(239, 68, 68, 0.4)' : (urlResult.verdict === 'SUSPICIOUS' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.4)')}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={urlResult.verdict === 'MALICIOUS' ? 'badge-critical' : (urlResult.verdict === 'SUSPICIOUS' ? 'badge-high' : 'badge-safe')}>
                      {urlResult.verdict}
                    </span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>Risk: {urlResult.risk_score}/100</span>
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '8px' }}>
                    {urlResult.classification}
                  </div>
                  <p style={{ fontSize: '0.78rem', marginTop: '4px', color: 'var(--text-main)' }}>
                    {urlResult.recommendation}
                  </p>
                </div>

                <div>
                  <h4 style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Triggered Heuristic Flags:
                  </h4>
                  <ul style={{ paddingLeft: '18px', fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {urlResult.reasons?.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-subtle)', fontSize: '0.82rem' }}>
                Enter a link and click scan to run real-time threat intelligence.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Quishing / Dual-Module QR Scanner */}
      {activeTab === 'qr' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <QrCode size={20} color="#38BDF8" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Quishing & Dual-Module QR Inspection</h3>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginBottom: '16px' }}>
              Detects advanced QR obfuscation exploits where center-pixel email gateway decoders are tricked into approving malicious barcodes (Legere 2026).
            </p>

            <form onSubmit={handleQRScan} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Decoded QR Payload URL:
                </label>
                <input
                  type="text"
                  value={qrInput}
                  onChange={(e) => setQrInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: '#0B0F19',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              {/* Dual-Module Toggle Simulation */}
              <div style={{
                padding: '12px',
                borderRadius: '8px',
                background: 'rgba(30, 41, 59, 0.4)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>Simulate Dual-Module QR Structure</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Emulates sub-module pixel overlay (2-5px) targeting ZXing/Sophos center sampling</div>
                </div>
                <input
                  type="checkbox"
                  checked={isDualModuleSim}
                  onChange={(e) => setIsDualModuleSim(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>

              <button
                type="submit"
                disabled={qrLoading}
                className="btn-cyber-primary"
                style={{ justifyContent: 'center' }}
              >
                {qrLoading ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                <span>Inspect QR Code for Evasion</span>
              </button>
            </form>
          </div>

          {/* Results */}
          <div className="glass-panel" style={{ padding: '22px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px' }}>Quishing Analysis</h3>
            {qrLoading ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 10px auto' }} />
                <div>Performing sub-module pixel variance & gateway evasion check...</div>
              </div>
            ) : qrResult ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{
                  padding: '14px',
                  borderRadius: '10px',
                  background: qrResult.dual_module_evasion_detected ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  border: `1px solid ${qrResult.dual_module_evasion_detected ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={qrResult.dual_module_evasion_detected ? 'badge-critical' : 'badge-safe'}>
                      {qrResult.verdict}
                    </span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>Risk: {qrResult.quishing_risk_score}/100</span>
                  </div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, marginTop: '8px', color: '#FFFFFF' }}>
                    {qrResult.dual_module_evasion_detected ? '⚠️ DUAL-MODULE EVASION DETECTED' : 'Standard Barcode'}
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Structural Indicators:
                  </h4>
                  <ul style={{ paddingLeft: '18px', fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {qrResult.evasion_indicators?.map((ind, i) => (
                      <li key={i}>{ind}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Action Plan:
                  </h4>
                  <ul style={{ paddingLeft: '18px', fontSize: '0.78rem', color: '#F87171', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {qrResult.mitigation_instructions?.map((inst, i) => (
                      <li key={i}>{inst}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-subtle)', fontSize: '0.82rem' }}>
                Run scan to analyze QR code payload and check for center-pixel evasion signatures.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Email / BEC Inspector */}
      {activeTab === 'email' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '22px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>Business Email Compromise (BEC) Inspector</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginBottom: '16px' }}>
              Evaluates email body text for urgency coercion, fraudulent GST/Tally payment lures, and fake executive instructions.
            </p>

            <form onSubmit={handleEmailScan} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Subject Line:</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: '#0B0F19', color: '#FFF', fontSize: '0.82rem', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Sender Address:</label>
                <input
                  type="text"
                  value={emailSender}
                  onChange={(e) => setEmailSender(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: '#0B0F19', color: '#FFF', fontSize: '0.82rem', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Email Body Content:</label>
                <textarea
                  rows={6}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: '#0B0F19', color: '#FFF', fontSize: '0.82rem', marginTop: '4px' }}
                />
              </div>

              <button type="submit" disabled={emailLoading} className="btn-cyber-primary" style={{ justifyContent: 'center' }}>
                {emailLoading ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                <span>Inspect Email for BEC Signals</span>
              </button>
            </form>
          </div>

          {/* Results */}
          <div className="glass-panel" style={{ padding: '22px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px' }}>BEC Risk Assessment</h3>
            {emailLoading ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 10px auto' }} />
                <div>Analyzing NLP urgency and payment manipulation signals...</div>
              </div>
            ) : emailResult ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{
                  padding: '14px',
                  borderRadius: '10px',
                  background: emailResult.verdict === 'MALICIOUS_PHISHING' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  border: `1px solid ${emailResult.verdict === 'MALICIOUS_PHISHING' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={emailResult.verdict === 'MALICIOUS_PHISHING' ? 'badge-critical' : 'badge-safe'}>
                      {emailResult.verdict}
                    </span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>Risk: {emailResult.risk_score}/100</span>
                  </div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, marginTop: '8px' }}>
                    {emailResult.classification}
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Detected Behavioral Flags:
                  </h4>
                  <ul style={{ paddingLeft: '18px', fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {emailResult.flags?.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', fontWeight: 600 }}>REMEDIATION ADVISORY:</span>
                  <p style={{ fontSize: '0.78rem', color: '#F87171', marginTop: '2px' }}>{emailResult.recommendation}</p>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-subtle)', fontSize: '0.82rem' }}>
                Click inspect to evaluate email content.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Network Isolation Forest NIDS */}
      {activeTab === 'network' && (
        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Isolation Forest Anomaly Classifier</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                Evaluates network sessions using unsupervised Isolation Forests + Post-Scoring Destination Allowlist (Sinanian 2026).
              </p>
            </div>
            <button
              onClick={handleLogScan}
              disabled={logLoading}
              className="btn-cyber-primary"
            >
              {logLoading ? <Loader2 size={16} className="animate-spin" /> : <Network size={16} />}
              <span>Process Network Batch</span>
            </button>
          </div>

          {logLoading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 10px auto' }} />
              <div>Computing Isolation Forest partition depths and evaluating allowlists...</div>
            </div>
          ) : logResult ? (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '18px' }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>FLOWS PROCESSED</span>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{logResult.total_flows_analyzed}</div>
                </div>
                <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
                  <span style={{ fontSize: '0.72rem', color: '#F87171' }}>CRITICAL ANOMALIES</span>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#F87171' }}>{logResult.critical_anomalies_count}</div>
                </div>
                <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>OVERALL RISK INDEX</span>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FBBF24' }}>{logResult.overall_traffic_risk_index}/100</div>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-subtle)' }}>
                      <th style={{ padding: '8px' }}>Flow ID</th>
                      <th style={{ padding: '8px' }}>Source IP</th>
                      <th style={{ padding: '8px' }}>Destination</th>
                      <th style={{ padding: '8px' }}>Port</th>
                      <th style={{ padding: '8px' }}>Verdict</th>
                      <th style={{ padding: '8px' }}>Threat Classification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logResult.results?.map((r) => (
                      <tr key={r.flow_id} style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.3)' }}>
                        <td style={{ padding: '10px 8px', fontFamily: 'var(--font-mono)' }}>{r.flow_id}</td>
                        <td style={{ padding: '10px 8px', fontFamily: 'var(--font-mono)' }}>{r.src_ip}</td>
                        <td style={{ padding: '10px 8px', color: '#38BDF8' }}>{r.dest_host || r.dst_ip}</td>
                        <td style={{ padding: '10px 8px', fontFamily: 'var(--font-mono)' }}>{r.dst_port}</td>
                        <td style={{ padding: '10px 8px' }}>
                          <span className={r.severity === 'CRITICAL' ? 'badge-critical' : (r.severity === 'HIGH' ? 'badge-high' : 'badge-safe')}>
                            {r.verdict}
                          </span>
                        </td>
                        <td style={{ padding: '10px 8px', color: r.severity === 'CRITICAL' ? '#FCA5A5' : 'var(--text-muted)' }}>
                          {r.threat_type}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-subtle)' }}>
              Click "Process Network Batch" to run the Isolation Forest anomaly detector.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
