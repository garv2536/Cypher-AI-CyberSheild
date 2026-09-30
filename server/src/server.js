require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const scanRoutes = require('./routes/scan');
const threatRoutes = require('./routes/threats');
const postureRoutes = require('./routes/posture');
const reportRoutes = require('./routes/reports');
const simulatedTraffic = require('./services/simulatedLiveTraffic');
const { connectDB, isConnected, Incident, User } = require('./config/db');

const app = express();
const server = http.createServer(app);

// Connect to MongoDB
connectDB();

// Initialize Socket.io with permissive CORS for local dev
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/threats', threatRoutes);
app.use('/api/posture', postureRoutes);
app.use('/api/reports', reportRoutes);

// Health check JSON endpoint
app.get('/api/health', async (req, res) => {
  let activeIncidents = 0;
  let usersRegistered = 0;
  try {
    if (isConnected()) {
      activeIncidents = await Incident.countDocuments();
      usersRegistered = await User.countDocuments();
    }
  } catch (e) {}

  res.json({
    status: 'online',
    system: 'BizRaksha Central Security Orchestrator',
    database: isConnected() ? 'MongoDB Connected' : 'Disconnected / Connecting',
    active_incidents: activeIncidents,
    users_registered: usersRegistered,
    timestamp: new Date().toISOString()
  });
});

// Interactive Backend API Landing Page on Root (http://localhost:5000/)
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>BizRaksha Backend API Gateway</title>
      <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2338BDF8'><path d='M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z'/></svg>">
      <style>
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #090D16;
          color: #F8FAFC;
          padding: 30px;
        }
        .container {
          max-width: 900px;
          margin: 0 auto;
        }
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #1E293B;
          padding-bottom: 20px;
          margin-bottom: 25px;
        }
        .title {
          font-size: 1.6rem;
          font-weight: 800;
        }
        .status-badge {
          background: rgba(16, 185, 129, 0.15);
          color: #34D399;
          border: 1px solid rgba(16, 185, 129, 0.4);
          padding: 6px 14px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.85rem;
        }
        .btn-launch {
          display: inline-block;
          background: linear-gradient(135deg, #2563EB 0%, #06B6D4 100%);
          color: #FFF;
          text-decoration: none;
          padding: 10px 18px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.88rem;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 30px;
        }
        .card {
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid #334155;
          border-radius: 10px;
          padding: 16px;
        }
        .card h3 {
          margin-top: 0;
          font-size: 1rem;
          color: #38BDF8;
        }
        .endpoint-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .endpoint-item {
          background: #0F172A;
          border: 1px solid #1E293B;
          border-radius: 8px;
          padding: 12px 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .method {
          font-family: monospace;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          margin-right: 8px;
        }
        .get { background: rgba(59, 130, 246, 0.2); color: #60A5FA; border: 1px solid rgba(59, 130, 246, 0.4); }
        .post { background: rgba(16, 185, 129, 0.2); color: #34D399; border: 1px solid rgba(16, 185, 129, 0.4); }
        .url { font-family: monospace; font-size: 0.88rem; color: #E2E8F0; }
        .desc { font-size: 0.75rem; color: #94A3B8; }
        a { color: #38BDF8; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div>
            <div class="title">🛡️ BizRaksha Backend API Gateway</div>
            <div style="color: #94A3B8; font-size: 0.85rem; margin-top: 4px;">Node.js / Express.js REST Orchestrator on Port 5000</div>
          </div>
          <div style="display: flex; gap: 12px; align-items: center;">
            <span class="status-badge">● ONLINE & HEALTHY</span>
            <a href="http://localhost:5173" class="btn-launch">Open Web Dashboard ➔</a>
          </div>
        </div>

        <div class="grid">
          <div class="card">
            <h3>🌐 Frontend Dashboard</h3>
            <p style="font-size: 0.82rem; color: #94A3B8;">The full React.js command center is running on port 5173.</p>
            <a href="http://localhost:5173" target="_blank">👉 http://localhost:5173</a>
          </div>
          <div class="card">
            <h3>🧠 Python AI Microservice</h3>
            <p style="font-size: 0.82rem; color: #94A3B8;">FastAPI ML Engine (Isolation Forest, Quishing, BLUF) with Swagger docs.</p>
            <a href="http://localhost:8000/docs" target="_blank">👉 http://localhost:8000/docs</a>
          </div>
        </div>

        <h2 style="font-size: 1.15rem; margin-bottom: 14px;">Available REST API Endpoints</h2>
        <div class="endpoint-list">
          <div class="endpoint-item">
            <div>
              <span class="method get">GET</span>
              <a href="/api/health" class="url">/api/health</a>
              <div class="desc">System health, registered users, and active incident counts</div>
            </div>
            <a href="/api/health" target="_blank">Test ↗</a>
          </div>

          <div class="endpoint-item">
            <div>
              <span class="method post">POST</span>
              <span class="url">/api/auth/login</span>
              <div class="desc">User login with JWT generation (demo: admin@bizraksha.local / admin123)</div>
            </div>
          </div>

          <div class="endpoint-item">
            <div>
              <span class="method post">POST</span>
              <span class="url">/api/auth/register</span>
              <div class="desc">Register new MSME enterprise user with role selection</div>
            </div>
          </div>

          <div class="endpoint-item">
            <div>
              <span class="method get">GET</span>
              <a href="/api/threats/incidents" class="url">/api/threats/incidents</a>
              <div class="desc">List of all active and contained security threats</div>
            </div>
            <a href="/api/threats/incidents" target="_blank">Test ↗</a>
          </div>

          <div class="endpoint-item">
            <div>
              <span class="method post">POST</span>
              <span class="url">/api/scan/url</span>
              <div class="desc">Phishing & malicious URL lexical entropy analysis</div>
            </div>
          </div>

          <div class="endpoint-item">
            <div>
              <span class="method post">POST</span>
              <span class="url">/api/scan/qr</span>
              <div class="desc">Dual-module QR & Quishing gateway evasion detection (Legere 2026)</div>
            </div>
          </div>

          <div class="endpoint-item">
            <div>
              <span class="method post">POST</span>
              <span class="url">/api/scan/network-logs</span>
              <div class="desc">Unsupervised Isolation Forest flow anomaly classifier (Sinanian 2026)</div>
            </div>
          </div>

          <div class="endpoint-item">
            <div>
              <span class="method post">POST</span>
              <span class="url">/api/threats/translate-bluf</span>
              <div class="desc">Executive CTI BLUF risk translation engine (Aguilar 2026)</div>
            </div>
          </div>

          <div class="endpoint-item">
            <div>
              <span class="method get">GET</span>
              <a href="/api/posture" class="url">/api/posture</a>
              <div class="desc">Current NIST CSF 2.0 & CERT-In security posture grade</div>
            </div>
            <a href="/api/posture" target="_blank">Test ↗</a>
          </div>

          <div class="endpoint-item">
            <div>
              <span class="method get">GET</span>
              <a href="/api/reports/executive" class="url">/api/reports/executive</a>
              <div class="desc">Compiled executive & CERT-In compliance audit summary</div>
            </div>
            <a href="/api/reports/executive" target="_blank">Test ↗</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Socket connection
io.on('connection', (socket) => {
  console.log('⚡ Client connected to security telemetry socket:', socket.id);
  socket.emit('connection_ack', { message: 'Connected to BizRaksha real-time event pipeline' });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected from telemetry socket:', socket.id);
  });
});

// Start simulated real-time telemetry events
simulatedTraffic.start(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🛡️ BizRaksha Server running on http://localhost:${PORT}`);
});
