import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ThreatScanner from './pages/ThreatScanner';
import IncidentResponse from './pages/IncidentResponse';
import ExecutiveTranslator from './pages/ExecutiveTranslator';
import PostureAssessment from './pages/PostureAssessment';
import AnalyticsReports from './pages/AnalyticsReports';
import Login from './pages/Login';
import { SecurityProvider, useSecurity } from './context/SecurityContext';
import { AlertCircle, X, Loader2 } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, authLoading, activeNotification, setActiveNotification } = useSecurity();

  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-muted)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 size={36} className="animate-spin" color="#38BDF8" style={{ margin: '0 auto 12px auto' }} />
          <div style={{ fontSize: '0.85rem' }}>Authenticating CyberShield Session...</div>
        </div>
      </div>
    );
  }

  // If user is not logged in, show Login & Registration screen
  if (!user) {
    return <Login />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      {/* Top Notification Toast */}
      {activeNotification && (
        <div style={{
          backgroundColor: '#991B1B',
          color: '#FFFFFF',
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.82rem',
          fontWeight: 600,
          zIndex: 50
        }}>
          <div 
            onClick={() => setActiveTab('incidents')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flex: 1 }}
          >
            <AlertCircle size={18} />
            <span>{activeNotification.title} — {activeNotification.message}</span>
            <span style={{ textDecoration: 'underline', marginLeft: '8px', fontSize: '0.78rem', color: '#FECACA' }}>View Incident →</span>
          </div>
          <button
            onClick={() => setActiveNotification(null)}
            style={{ background: 'transparent', border: 'none', color: '#FFF', cursor: 'pointer', padding: '4px' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Top Navbar with User Profile & Logout */}
      <Navbar setActiveTab={setActiveTab} />

      {/* Main Layout Area */}
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main style={{ flex: 1, overflowY: 'auto', maxHeight: 'calc(100vh - 68px)' }}>
          {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
          {activeTab === 'scanner' && <ThreatScanner />}
          {activeTab === 'incidents' && <IncidentResponse />}
          {activeTab === 'translator' && <ExecutiveTranslator />}
          {activeTab === 'posture' && <PostureAssessment />}
          {activeTab === 'reports' && <AnalyticsReports />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SecurityProvider>
      <AppContent />
    </SecurityProvider>
  );
}
