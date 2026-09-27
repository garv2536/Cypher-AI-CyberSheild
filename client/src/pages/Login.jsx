import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Building, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Shield, 
  Zap, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';

export default function Login() {
  const { login, register } = useSecurity();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('BUSINESS_OWNER');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        if (!name || !email || !password) {
          setError('Please fill in all required fields.');
          setLoading(false);
          return;
        }
        const res = await register({ name, email, password, company, role });
        if (!res.success) setError(res.message);
      } else {
        if (!email || !password) {
          setError('Please enter your email and password.');
          setLoading(false);
          return;
        }
        const res = await login(email, password);
        if (!res.success) setError(res.message);
      }
    } catch (err) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-Click Demo Login
  const handleQuickDemo = async (demoEmail, demoPassword) => {
    setError(null);
    setLoading(true);
    const res = await login(demoEmail, demoPassword);
    if (!res.success) setError(res.message);
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'radial-gradient(circle at 50% 20%, rgba(37, 99, 235, 0.15) 0%, rgba(9, 13, 22, 1) 70%)',
      position: 'relative'
    }}>
      {/* Background cyber grid effect */}
      <div style={{
        maxWidth: '460px',
        width: '100%',
        zIndex: 10
      }}>
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px auto',
            boxShadow: '0 0 25px rgba(37, 99, 235, 0.5)'
          }}>
            <ShieldCheck size={32} color="#FFFFFF" />
          </div>

          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Biz<span style={{ color: '#38BDF8' }}>Raksha</span>
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Cypher: AI-Powered CyberShield for MSMEs
          </p>
        </div>

        {/* Main Auth Card */}
        <div className="glass-panel" style={{
          padding: '30px',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
        }}>
          {/* Tab Switcher */}
          <div style={{
            display: 'flex',
            background: 'rgba(11, 15, 25, 0.7)',
            padding: '4px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid var(--border-color)'
          }}>
            <button
              type="button"
              onClick={() => { setIsRegister(false); setError(null); }}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '6px',
                border: 'none',
                background: !isRegister ? 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' : 'transparent',
                color: !isRegister ? '#FFFFFF' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsRegister(true); setError(null); }}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '6px',
                border: 'none',
                background: isRegister ? 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' : 'transparent',
                color: isRegister ? '#FFFFFF' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Create Account
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#F87171',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {isRegister && (
              <>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Full Name</label>
                  <div style={{ position: 'relative', marginTop: '4px' }}>
                    <User size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input
                      type="text"
                      placeholder="e.g. Garv Pratap Singh"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 38px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        background: '#0B0F19',
                        color: '#FFF',
                        fontSize: '0.84rem'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Company / Enterprise Name</label>
                  <div style={{ position: 'relative', marginTop: '4px' }}>
                    <Building size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input
                      type="text"
                      placeholder="e.g. Vanguard Auto Components"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 38px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        background: '#0B0F19',
                        color: '#FFF',
                        fontSize: '0.84rem'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Role in Organization</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: '#0B0F19',
                      color: '#FFF',
                      fontSize: '0.84rem',
                      marginTop: '4px'
                    }}
                  >
                    <option value="BUSINESS_OWNER">MSME Business Owner / Managing Director</option>
                    <option value="IT_SECURITY_LEAD">IT Lead / Security Officer</option>
                    <option value="FINANCE_ADMIN">Finance / Accounts Lead</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Work Email Address</label>
              <div style={{ position: 'relative', marginTop: '4px' }}>
                <Mail size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="email"
                  placeholder="name@company.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: '#0B0F19',
                    color: '#FFF',
                    fontSize: '0.84rem'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Password</label>
              <div style={{ position: 'relative', marginTop: '4px' }}>
                <Lock size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 38px 10px 38px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: '#0B0F19',
                    color: '#FFF',
                    fontSize: '0.84rem'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '10px',
                    background: 'transparent',
                    border: 'none',
                    color: '#64748B',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-cyber-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '6px' }}
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Shield size={18} />}
              <span>{isRegister ? 'Register & Protect Enterprise' : 'Secure Login to Command Center'}</span>
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', fontWeight: 700, textTransform: 'uppercase', display: 'block', textAlign: 'center', marginBottom: '10px' }}>
              ⚡ 1-Click Demo Accounts
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin@bizraksha.local', 'admin123')}
                className="btn-cyber-outline"
                style={{ fontSize: '0.72rem', padding: '8px', justifyContent: 'center' }}
              >
                <Zap size={13} color="#38BDF8" />
                <span>Priya (Owner)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('rahul.verma@vanguardauto.in', 'securepass')}
                className="btn-cyber-outline"
                style={{ fontSize: '0.72rem', padding: '8px', justifyContent: 'center' }}
              >
                <ShieldCheck size={13} color="#34D399" />
                <span>Rahul (IT Lead)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
          Aligned with CERT-In Cybersecurity Directives & NIST CSF 2.0
        </div>
      </div>
    </div>
  );
}
