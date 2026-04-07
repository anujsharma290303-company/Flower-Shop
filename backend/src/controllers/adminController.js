const { Op } = require('sequelize');
const { Order, Product } = require('../models');

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

module.exports = {
  getDashboardStats,
};
