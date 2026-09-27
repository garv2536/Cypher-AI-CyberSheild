import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { 
  getIncidentsApi, 
  getPostureApi, 
  executeRemediationApi,
  loginUserApi,
  registerUserApi,
  getCurrentUserApi,
  logoutUserApi
} from '../services/api';

const SecurityContext = createContext();

export const SecurityProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [incidents, setIncidents] = useState([]);
  const [posture, setPosture] = useState({
    score: 67,
    grade: 'C (Vulnerable / Gaps Identified)',
    status: 'ATTENTION_REQUIRED',
    mfa_enabled: true,
    automated_backups: true,
    firewall_active: true,
    employee_training: false,
    incident_plan_exists: false,
    patch_management: true,
    network_segmentation: false,
    edr_installed: true,
    nist_alignment: { IDENTIFY: 70, PROTECT: 65, DETECT: 80, RESPOND: 60, RECOVER: 55 }
  });
  const [liveTelemetry, setLiveTelemetry] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [activeNotification, setActiveNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check existing token on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('bizraksha_token');
      const storedUser = localStorage.getItem('bizraksha_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          const res = await getCurrentUserApi();
          if (res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('bizraksha_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session expired or invalid, logging out.');
          localStorage.removeItem('bizraksha_token');
          localStorage.removeItem('bizraksha_user');
          setUser(null);
        }
      } else {
        // Automatically provide demo guest session if desired, or let user log in
        // Default to not logged in so login screen is showcased
        setUser(null);
      }
      setAuthLoading(false);
    };

    initAuth();
  }, []);

  // Fetch security telemetry data
  const refreshData = async () => {
    try {
      setLoading(true);
      const [incRes, posRes] = await Promise.all([
        getIncidentsApi(),
        getPostureApi()
      ]);
      if (incRes.data?.incidents) setIncidents(incRes.data.incidents);
      if (posRes.data?.data) setPosture(posRes.data.data);
    } catch (err) {
      console.error('Error loading initial security data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    refreshData();

    // Setup Socket.io
    const socket = io('http://localhost:5000', {
      reconnectionAttempts: 5,
      timeout: 3000
    });

    socket.on('connect', () => {
      setSocketConnected(true);
    });

    socket.on('disconnect', () => {
      setSocketConnected(false);
    });

    socket.on('telemetry_event', (event) => {
      setLiveTelemetry((prev) => [event, ...prev.slice(0, 35)]);
    });

    socket.on('new_incident_alert', (newIncident) => {
      setIncidents((prev) => [newIncident, ...prev]);
      setActiveNotification({
        title: '⚠️ CRITICAL ALERT: ' + newIncident.title,
        message: newIncident.bluf,
        severity: 'CRITICAL',
        id: newIncident.id
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  // Auth functions
  const login = async (email, password) => {
    try {
      const res = await loginUserApi(email, password);
      if (res.data?.success) {
        localStorage.setItem('bizraksha_token', res.data.token);
        localStorage.setItem('bizraksha_user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, message: res.data?.message || 'Login failed' };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || err.message || 'Login error' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const res = await registerUserApi(userData);
      if (res.data?.success) {
        localStorage.setItem('bizraksha_token', res.data.token);
        localStorage.setItem('bizraksha_user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, message: res.data?.message || 'Registration failed' };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || err.message || 'Registration error' 
      };
    }
  };

  const logout = async () => {
    try {
      await logoutUserApi();
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem('bizraksha_token');
      localStorage.removeItem('bizraksha_user');
      setUser(null);
      setLiveTelemetry([]);
    }
  };

  const remediateIncident = async (incidentId, actionType) => {
    try {
      const res = await executeRemediationApi(incidentId, actionType);
      if (res.data?.success) {
        setIncidents((prev) =>
          prev.map((i) => (i.id === incidentId ? res.data.incident : i))
        );
        return { success: true, message: res.data.message };
      }
    } catch (err) {
      console.error('Remediation error:', err);
      return { success: false, message: err.message };
    }
  };

  return (
    <SecurityContext.Provider
      value={{
        user,
        authLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        incidents,
        setIncidents,
        posture,
        setPosture,
        liveTelemetry,
        socketConnected,
        activeNotification,
        setActiveNotification,
        remediateIncident,
        refreshData,
        loading
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => useContext(SecurityContext);
