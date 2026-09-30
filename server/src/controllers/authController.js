const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, isConnected, memoryStore } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'bizraksha_secure_jwt_secret_2026';

exports.register = async (req, res) => {
  try {
    const { name, email, password, company, role } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (isConnected()) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Account with this email already exists' });
      }

      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(password, salt);

      const nameParts = name.trim().split(' ');
      const avatar = nameParts.length > 1 
        ? (nameParts[0][0] + nameParts[1][0]).toUpperCase() 
        : nameParts[0].substring(0, 2).toUpperCase();

      const userId = 'usr-' + Date.now();
      const newUser = await User.create({
        id: userId,
        email: normalizedEmail,
        passwordHash,
        name: name.trim(),
        company: company ? company.trim() : 'My Enterprise MSME',
        role: role || 'BUSINESS_OWNER',
        avatar
      });

      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role, company: newUser.company },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully in MongoDB',
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
    } else {
      // In-Memory Fallback
      const existing = memoryStore.users.find(u => u.email === normalizedEmail);
      if (existing) {
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
        email: normalizedEmail,
        passwordHash,
        name: name.trim(),
        company: company ? company.trim() : 'My Enterprise MSME',
        role: role || 'BUSINESS_OWNER',
        avatar
      };
      memoryStore.users.push(newUser);

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
    }
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
    let user = null;

    if (isConnected()) {
      user = await User.findOne({ email: normalizedEmail });
    } else {
      user = memoryStore.users.find(u => u.email.toLowerCase() === normalizedEmail);
    }

    // Default demo user fallback if needed
    if (!user && (normalizedEmail === 'admin@bizraksha.local' || normalizedEmail === 'rahul.verma@vanguardauto.in')) {
      const defaultPassword = normalizedEmail === 'admin@bizraksha.local' ? 'admin123' : 'securepass';
      if (password === defaultPassword) {
        user = {
          id: normalizedEmail === 'admin@bizraksha.local' ? 'usr-1' : 'usr-2',
          email: normalizedEmail,
          passwordHash: bcrypt.hashSync(defaultPassword, 10),
          name: normalizedEmail === 'admin@bizraksha.local' ? 'Priya Sharma (Owner)' : 'Rahul Verma (IT Lead)',
          company: 'Vanguard Auto Components Pvt Ltd',
          role: normalizedEmail === 'admin@bizraksha.local' ? 'BUSINESS_OWNER' : 'IT_SECURITY_LEAD',
          avatar: normalizedEmail === 'admin@bizraksha.local' ? 'PS' : 'RV'
        };
      }
    }

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

    let user = null;
    if (isConnected()) {
      user = await User.findOne({ id: decoded.id });
    } else {
      user = memoryStore.users.find(u => u.id === decoded.id) || {
        id: decoded.id,
        name: 'Priya Sharma (Owner)',
        email: decoded.email,
        company: decoded.company || 'Vanguard Auto Components Pvt Ltd',
        role: decoded.role || 'BUSINESS_OWNER',
        avatar: 'PS'
      };
    }

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

exports.updateProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const { name, company, role, avatar } = req.body;

    if (isConnected()) {
      const user = await User.findOne({ id: decoded.id });
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      if (name) user.name = name.trim();
      if (company) user.company = company.trim();
      if (role) user.role = role;
      if (avatar) user.avatar = avatar;
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully in MongoDB',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          company: user.company,
          role: user.role,
          avatar: user.avatar
        }
      });
    } else {
      const user = memoryStore.users.find(u => u.id === decoded.id);
      if (user) {
        if (name) user.name = name.trim();
        if (company) user.company = company.trim();
        if (role) user.role = role;
        if (avatar) user.avatar = avatar;
      }

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: user || { id: decoded.id, name, company, role, avatar }
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Profile update failed', error: err.message });
  }
};

exports.logout = async (req, res) => {
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
};
