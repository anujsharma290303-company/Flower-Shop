const { Op } = require('sequelize');
const { Order, Product, User, CreditTransaction } = require('../models');

const handleControllerError = (res, error, defaultCode = 500) => {
  console.error('[AdminController Error]', error);
  const status = error.statusCode || defaultCode;
  const message = error.message || 'Internal server error';
  return res.status(status).json({ success: false, message });
};

const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalOrders, pendingOrders, totalProducts, revenueToday, recentOrders] = await Promise.all([
      Order.count(),
      Order.count({ where: { status: 'pending' } }),
      Product.count(),
      Order.sum('totalPrice', {
        where: { createdAt: { [Op.gte]: today }, paymentStatus: 'paid' },
      }),
      Order.findAll({
        limit: 5,
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'customerName', 'totalPrice', 'status', 'createdAt'],
      }),
    ]);

    return res.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        totalProducts,
        revenueToday: revenueToday || 0,
        recentOrders,
      },
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

const parsePositiveInt = (value) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) return null;
  return parsed;
};

const getUsers = async (req, res) => {
  try {
    const page = parsePositiveInt(req.query.page) || 1;
    const limit = parsePositiveInt(req.query.limit) || 20;
    const isActiveQuery = req.query.isActive;
    const where = {};

    if (isActiveQuery !== undefined) {
      const normalized = String(isActiveQuery).trim().toLowerCase();
      if (normalized === 'true' || normalized === '1') {
        where.isActive = true;
      } else if (normalized === 'false' || normalized === '0') {
        where.isActive = false;
      } else {
        return res.status(400).json({ success: false, message: 'isActive must be boolean-like' });
      }
    }

    const offset = (page - 1) * limit;
    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: ['id', 'firstName', 'lastName', 'email', 'isActive', 'credits', 'createdAt', 'updatedAt'],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    return res.json({
      success: true,
      data: {
        totalItems: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
        users: rows,
      },
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = parsePositiveInt(req.params.id);
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User id must be a positive integer' });
    }

    const user = await User.findByPk(userId, {
      attributes: ['id', 'firstName', 'lastName', 'email', 'isActive', 'credits', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Order,
          as: 'orders',
          attributes: ['id', 'status', 'paymentStatus', 'totalPrice', 'createdAt'],
          required: false,
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, data: user });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

const toggleUserActive = async (req, res) => {
  try {
    const userId = parsePositiveInt(req.params.id);
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User id must be a positive integer' });
    }

    const user = await User.findByPk(userId, {
      attributes: ['id', 'firstName', 'lastName', 'email', 'isActive', 'credits', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await user.update({ isActive: !user.isActive });

    return res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: user,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

const getCreditTransactionsAdmin = async (req, res) => {
  try {
    const page = parsePositiveInt(req.query.page) || 1;
    const limit = parsePositiveInt(req.query.limit) || 50;
    const type = req.query.type ? String(req.query.type).trim().toLowerCase() : null;
    const userId = req.query.userId ? parsePositiveInt(req.query.userId) : null;
    const where = {};

    if (type) {
      if (!['earn', 'redeem', 'adjustment'].includes(type)) {
        return res.status(400).json({ success: false, message: 'type must be one of: earn, redeem, adjustment' });
      }
      where.type = type;
    }

    if (req.query.userId !== undefined && !userId) {
      return res.status(400).json({ success: false, message: 'userId must be a positive integer' });
    }

    if (userId) {
      where.userId = userId;
    }

    const offset = (page - 1) * limit;
    const { count, rows } = await CreditTransaction.findAndCountAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: Order, as: 'order', attributes: ['id', 'status', 'paymentStatus', 'totalPrice'], required: false },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    return res.json({
      success: true,
      data: {
        totalItems: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
        transactions: rows,
      },
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  getUserById,
  toggleUserActive,
  getCreditTransactionsAdmin,
};
