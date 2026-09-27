import React, { useState, useEffect } from 'react';
import { FileText, Download, Printer, ShieldCheck, CheckCircle2, AlertTriangle, Building2, Calendar } from 'lucide-react';
import { getExecutiveReportApi } from '../services/api';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export default function AnalyticsReports() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await getExecutiveReportApi();
      setReportData(res.data?.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    const reportElement = document.getElementById('printable-executive-report');
    if (!reportElement) return;

    const canvas = await html2canvas(reportElement, { scale: 2, backgroundColor: '#0F172A' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`BizRaksha_Executive_Report_${Date.now()}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Executive & Regulatory Compliance Reports</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Export ready-to-present cyber resilience reports for business leadership and regulatory audits (CERT-In / DPDP Act).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handlePrint} className="btn-cyber-outline" style={{ fontSize: '0.8rem' }}>
            <Printer size={16} />
            <span>Print Report</span>
          </button>
          <button onClick={handleDownloadPDF} className="btn-cyber-primary" style={{ fontSize: '0.8rem' }}>
            <Download size={16} />
            <span>Export Official PDF</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading compiled audit data...
        </div>
      ) : reportData ? (
        <div id="printable-executive-report" className="glass-panel" style={{
          padding: '32px',
          backgroundColor: '#0F172A',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          {/* Header of Report */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '2px solid var(--border-color)', paddingBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                  Biz<span style={{ color: '#38BDF8' }}>Raksha</span>
                </span>
                <span className="badge-safe" style={{ fontSize: '0.7rem' }}>CYPHER DEFENSE SUITE</span>
              </div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '6px' }}>
                Executive Cybersecurity Health & Incident Audit Briefing
              </h1>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Aligned with NIST Cybersecurity Framework (CSF) 2.0 & Indian Computer Emergency Response Team (CERT-In)
              </p>
            </div>

            <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <div><strong>Report ID:</strong> {reportData.report_id}</div>
              <div><strong>Generated:</strong> {new Date(reportData.generated_at).toLocaleDateString()}</div>
              <div><strong>Organization:</strong> {reportData.company}</div>
            </div>
          </div>

          {/* Key Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>SECURITY POSTURE SCORE</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38BDF8' }}>{reportData.security_posture_score}/100</div>
              <div style={{ fontSize: '0.72rem', color: '#34D399', fontWeight: 600 }}>Grade: {reportData.posture_grade}</div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>FINANCIAL LOSS PREVENTED</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10B981' }}>{reportData.kpis?.estimated_financial_loss_prevented}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Via Real-time Preemption</div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>THREATS NEUTRALIZED</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FBBF24' }}>{reportData.kpis?.contained_threats}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>1-Click Containment Active</div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>CERT-IN STATUS</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38BDF8', marginTop: '4px' }}>
                {reportData.compliance_status?.cert_in_guidelines}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>6-Hour SLA Compliant</div>
            </div>
          </div>

          {/* Section: NIST CSF 2.0 Function Breakdown */}
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '10px', color: '#38BDF8' }}>
              NIST CSF 2.0 Core Function Ratings:
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
              {Object.entries(reportData.nist_csf_summary || {}).map(([key, val]) => (
                <div key={key} style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', fontWeight: 600 }}>{key}</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: val >= 70 ? '#34D399' : '#FBBF24' }}>{val}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Prioritized Executive Directives */}
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '10px', color: '#10B981' }}>
              Strategic Priorities for Leadership (Next 30 Days):
            </h3>
            <ul style={{ paddingLeft: '20px', fontSize: '0.82rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {reportData.actionable_executive_priorities?.map((act, i) => (
                <li key={i}>{act}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
