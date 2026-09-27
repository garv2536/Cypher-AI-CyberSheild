const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'bizraksha_secure_jwt_secret_2026';

// Seed default demo accounts with hashed passwords
const DEMO_USERS = [
  {
    id: 'usr-1',
    email: 'admin@bizraksha.local',
    passwordHash: bcrypt.hashSync('admin123', 10),
    name: 'Priya Sharma',
    company: 'Vanguard Auto Components Pvt Ltd',
    role: 'BUSINESS_OWNER',
    avatar: 'PS',
    created_at: new Date().toISOString()
  },
  {
    id: 'usr-2',
    email: 'rahul.verma@vanguardauto.in',
    passwordHash: bcrypt.hashSync('securepass', 10),
    name: 'Rahul Verma',
    company: 'Vanguard Auto Components Pvt Ltd',
    role: 'IT_SECURITY_LEAD',
    avatar: 'RV',
    created_at: new Date().toISOString()
  }
];

// Ensure default users exist in db.users
if (!db.users || db.users.length === 0) {
  db.users = [...DEMO_USERS];
} else {
  // Merge if not present
  DEMO_USERS.forEach(demo => {
    if (!db.users.find(u => u.email === demo.email)) {
      db.users.push(demo);
    }
  });
}

exports.register = async (req, res) => {
  try {
    const { name, email, password, company, role } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Account with this email already exists' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const nameParts = name.trim().split(' ');
    const avatar = nameParts.length > 1 
      ? (nameParts[0][0] + nameParts[1][0]).toUpperCase() 
      : nameParts[0].substring(0, 2).toUpperCase();

    const newUser = {
      id: 'usr-' + Date.now(),
      email: email.toLowerCase().trim(),
      passwordHash,
      name: name.trim(),
      company: company ? company.trim() : 'My Enterprise MSME',
      role: role || 'BUSINESS_OWNER',
      avatar,
      created_at: new Date().toISOString()
    };

    db.users.push(newUser);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, company: newUser.company },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        company: newUser.company,
        role: newUser.role,
        avatar: newUser.avatar
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Registration failed', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = db.users.find(u => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, company: user.company },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        company: user.company,
        role: user.role,
        avatar: user.avatar || 'US'
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Authentication error', error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = db.users.find(u => u.id === decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        company: user.company,
        role: user.role,
        avatar: user.avatar || 'US'
      }
    });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session token' });
  }
};

exports.logout = async (req, res) => {
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
};
