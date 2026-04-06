const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin } = require('../models/index');

const handleControllerError = (res, error, context) => {
  console.error(`[AuthController] ${context}:`, error.message);
  return res.status(500).json({ success: false, message: 'Internal server error' });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not configured');
    return res.status(500).json({ success: false, message: 'Authentication is not configured' });
  }

  try {
    const normalizedEmail = String(email).toLowerCase();
    const admin = await Admin.findOne({ where: { email: normalizedEmail } });

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!admin.isActive) {
      return res.status(403).json({ success: false, message: 'Account is inactive' });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        admin: { id: admin.id, email: admin.email, role: admin.role },
      },
    });
  } catch (error) {
    return handleControllerError(res, error, 'Login error');
  }
};

const me = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.admin.id, {
      attributes: ['id', 'email', 'role', 'isActive', 'createdAt', 'updatedAt'],
    });

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    return res.json({ success: true, data: admin });
  } catch (error) {
    return handleControllerError(res, error, 'Fetch current admin error');
  }
};

module.exports = {
  login,
  me,
};
