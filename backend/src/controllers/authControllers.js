const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin } = require('../models/index');

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not configured');
    return res.status(500).json({ message: 'Authentication is not configured' });
  }

  try {
    const normalizedEmail = String(email).toLowerCase();
    const admin = await Admin.findOne({ where: { email: normalizedEmail } });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!admin.isActive) {
      return res.status(403).json({ message: 'Account is inactive' });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
    );

    res.json({
      message: 'Login successful',
      token,
      admin: { id: admin.id, email: admin.email, role: admin.role },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const me = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.admin.id, {
      attributes: ['id', 'email', 'role', 'isActive', 'createdAt', 'updatedAt'],
    });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    return res.json({ admin });
  } catch (error) {
    console.error('Fetch current admin error:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  login,
  me,
};
