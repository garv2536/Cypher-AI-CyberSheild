import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token from localStorage to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bizraksha_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Auth APIs
export const loginUserApi = (email, password) => api.post('/auth/login', { email, password });
export const registerUserApi = (userData) => api.post('/auth/register', userData);
export const getCurrentUserApi = () => api.get('/auth/me');
export const logoutUserApi = () => api.post('/auth/logout');

// Scan APIs
export const scanUrlApi = (url) => api.post('/scan/url', { url });
export const scanQRApi = (qrData, metadata = {}) => api.post('/scan/qr', { qr_data: qrData, ...metadata });
export const scanNetworkLogsApi = (flows) => api.post('/scan/network-logs', { flows });
export const scanEmailApi = (emailData) => api.post('/scan/email', emailData);
export const getScanHistoryApi = () => api.get('/scan/history');

// Threat & Incident APIs
export const getIncidentsApi = () => api.get('/threats/incidents');
export const executeRemediationApi = (incidentId, actionType) => api.post('/threats/remediate', { incidentId, actionType });
export const translateBLUFApi = (threatData) => api.post('/threats/translate-bluf', threatData);

// Posture & Report APIs
export const getPostureApi = () => api.get('/posture');
export const updatePostureApi = (answers) => api.post('/posture/update', answers);
export const getExecutiveReportApi = () => api.get('/reports/executive');

export default api;
