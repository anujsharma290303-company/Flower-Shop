const { Subscription, Order, User } = require('../models');
const { SUBSCRIPTION_STATUS, SUBSCRIPTION_FREQUENCY } = require('../validators/subscriptionValidator');

const handleControllerError = (res, error, defaultCode = 500) => {
  console.error('[SubscriptionController Error]', error);
  const status = error.statusCode || defaultCode;
  const message = error.message || 'Internal server error';
  return res.status(status).json({ success: false, message });
};

const parsePositiveInt = (value) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) return null;
  return parsed;
};

const create = async (req, res) => {
  try {
    const userId = req.user.id;
    const { frequency, nextDeliveryDate, startDate, orderId, deliveryAddress, note } = req.body || {};

    if (!SUBSCRIPTION_FREQUENCY.includes(frequency)) {
      return res.status(400).json({ success: false, message: `frequency must be one of: ${SUBSCRIPTION_FREQUENCY.join(', ')}` });
    }

    let normalizedOrderId = null;
    if (orderId !== undefined && orderId !== null && orderId !== '') {
      normalizedOrderId = parsePositiveInt(orderId);
      if (!normalizedOrderId) {
        return res.status(400).json({ success: false, message: 'orderId must be a positive integer' });
      }

      const linkedOrder = await Order.findByPk(normalizedOrderId);
      if (!linkedOrder) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      if (linkedOrder.userId && linkedOrder.userId !== userId) {
        return res.status(403).json({ success: false, message: 'You can only subscribe to your own order' });
      }
    }

    const subscription = await Subscription.create({
      userId,
      orderId: normalizedOrderId,
      frequency,
      status: 'active',
      startDate: startDate || undefined,
      nextDeliveryDate,
      deliveryAddress: deliveryAddress || null,
      note: note || null,
    });

    return res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      data: subscription,
    });
  } catch (error) {
    return handleControllerError(res, error, 500);
  }
};

const getMine = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parsePositiveInt(req.query.page) || 1;
    const limit = parsePositiveInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const where = { userId };

    if (req.query.status !== undefined) {
      const status = String(req.query.status).trim().toLowerCase();
      if (!SUBSCRIPTION_STATUS.includes(status)) {
        return res.status(400).json({ success: false, message: `status must be one of: ${SUBSCRIPTION_STATUS.join(', ')}` });
      }
      where.status = status;
    }

    const { count, rows } = await Subscription.findAndCountAll({
      where,
      include: [{ model: Order, as: 'order' }],
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
        subscriptions: rows,
      },
    });
  } catch (error) {
    return handleControllerError(res, error, 500);
  }
};

const getOneMine = async (req, res) => {
  try {
    const userId = req.user.id;
    const subscriptionId = parsePositiveInt(req.params.id);

    if (!subscriptionId) {
      return res.status(400).json({ success: false, message: 'Subscription id must be a positive integer' });
    }

    const subscription = await Subscription.findOne({
      where: { id: subscriptionId, userId },
      include: [{ model: Order, as: 'order' }],
    });

    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    return res.json({ success: true, data: subscription });
  } catch (error) {
    return handleControllerError(res, error, 500);
  }
};

const updateMine = async (req, res) => {
  try {
    const userId = req.user.id;
    const subscriptionId = parsePositiveInt(req.params.id);

    if (!subscriptionId) {
      return res.status(400).json({ success: false, message: 'Subscription id must be a positive integer' });
    }

    const subscription = await Subscription.findOne({ where: { id: subscriptionId, userId } });

    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    if (subscription.status === 'cancelled' && req.body.status && req.body.status !== 'cancelled') {
      return res.status(400).json({ success: false, message: 'Cancelled subscriptions cannot be reactivated' });
    }

    const payload = {};
    const allowed = ['status', 'frequency', 'nextDeliveryDate', 'lastDeliveryDate', 'deliveryAddress', 'note'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        payload[key] = req.body[key] === '' ? null : req.body[key];
      }
    }

    await subscription.update(payload);

    return res.json({
      success: true,
      message: 'Subscription updated successfully',
      data: subscription,
    });
  } catch (error) {
    return handleControllerError(res, error, 500);
  }
};

const getAllAdmin = async (req, res) => {
  try {
    const page = parsePositiveInt(req.query.page) || 1;
    const limit = parsePositiveInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    const where = {};

    if (req.query.status !== undefined) {
      const status = String(req.query.status).trim().toLowerCase();
      if (!SUBSCRIPTION_STATUS.includes(status)) {
        return res.status(400).json({ success: false, message: `status must be one of: ${SUBSCRIPTION_STATUS.join(', ')}` });
      }
      where.status = status;
    }

    if (req.query.userId !== undefined) {
      const userId = parsePositiveInt(req.query.userId);
      if (!userId) {
        return res.status(400).json({ success: false, message: 'userId must be a positive integer' });
      }
      where.userId = userId;
    }

    const { count, rows } = await Subscription.findAndCountAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: Order, as: 'order' },
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
        subscriptions: rows,
      },
    });
  } catch (error) {
    return handleControllerError(res, error, 500);
  }
};

const getOneAdmin = async (req, res) => {
  try {
    const subscriptionId = parsePositiveInt(req.params.id);

    if (!subscriptionId) {
      return res.status(400).json({ success: false, message: 'Subscription id must be a positive integer' });
    }

    const subscription = await Subscription.findByPk(subscriptionId, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: Order, as: 'order' },
      ],
    });

    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    return res.json({ success: true, data: subscription });
  } catch (error) {
    return handleControllerError(res, error, 500);
  }
};

const updateAdmin = async (req, res) => {
  try {
    const subscriptionId = parsePositiveInt(req.params.id);

    if (!subscriptionId) {
      return res.status(400).json({ success: false, message: 'Subscription id must be a positive integer' });
    }

    const subscription = await Subscription.findByPk(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    const payload = {};
    const allowed = ['status', 'frequency', 'nextDeliveryDate', 'lastDeliveryDate', 'deliveryAddress', 'note'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        payload[key] = req.body[key] === '' ? null : req.body[key];
      }
    }

    await subscription.update(payload);

    return res.json({
      success: true,
      message: 'Subscription updated successfully',
      data: subscription,
    });
  } catch (error) {
    return handleControllerError(res, error, 500);
  }
};

const removeAdmin = async (req, res) => {
  try {
    const subscriptionId = parsePositiveInt(req.params.id);

    if (!subscriptionId) {
      return res.status(400).json({ success: false, message: 'Subscription id must be a positive integer' });
    }

    const subscription = await Subscription.findByPk(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    await subscription.destroy();

    return res.json({ success: true, message: 'Subscription deleted successfully' });
  } catch (error) {
    return handleControllerError(res, error, 500);
  }
};

module.exports = {
  create,
  getMine,
  getOneMine,
  updateMine,
  getAllAdmin,
  getOneAdmin,
  updateAdmin,
  removeAdmin,
};
