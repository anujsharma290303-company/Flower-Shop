const { v4: uuidv4 } = require('uuid');
const { Payment, Order, OrderStatusLog, sequelize } = require('../models');

const DEFAULT_DELAY_MS = 2000;

const handleControllerError = (res, error, defaultCode = 500) => {
  console.error('[PaymentController Error]', error);
  const status = error.statusCode || defaultCode;
  const message = error.message || 'Internal server error';
  return res.status(status).json({ success: false, message });
};

const wait = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const parsePositiveInt = (value) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) return null;
  return parsed;
};

const parseBooleanLike = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') {
    if (value === 1) return true;
    if (value === 0) return false;
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true' || normalized === '1') return true;
    if (normalized === 'false' || normalized === '0') return false;
  }
  return undefined;
};

const captureAuthorizedPaymentForOrder = async (orderId, transaction) => {
  const payment = await Payment.findOne({
    where: { orderId, status: 'authorized' },
    order: [['createdAt', 'DESC']],
    transaction,
    lock: transaction ? transaction.LOCK.UPDATE : undefined,
  });

  if (!payment) {
    return { captured: false, payment: null };
  }

  await payment.update({ status: 'captured', capturedAt: new Date() }, { transaction });
  return { captured: true, payment };
};

const voidAuthorizedPaymentForOrder = async (orderId, transaction) => {
  const payment = await Payment.findOne({
    where: { orderId, status: 'authorized' },
    order: [['createdAt', 'DESC']],
    transaction,
    lock: transaction ? transaction.LOCK.UPDATE : undefined,
  });

  if (!payment) {
    return { voided: false, payment: null };
  }

  await payment.update({ status: 'voided', voidedAt: new Date() }, { transaction });
  return { voided: true, payment };
};

const pay = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { orderId, method, simulateSuccess, processingDelayMs } = req.body || {};

    const order = await Order.findByPk(orderId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!order) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.paymentStatus === 'paid') {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Order is already paid' });
    }

    const payment = await Payment.create(
      {
        orderId: order.id,
        amount: Number(order.totalPrice),
        currency: order.currency,
        status: 'pending',
        method,
        transactionId: `TXN-${uuidv4()}`,
      },
      { transaction },
    );

    const delayMs = Number.isInteger(Number(processingDelayMs))
      ? Math.max(0, Math.min(Number(processingDelayMs), 10000))
      : DEFAULT_DELAY_MS;

    await wait(delayMs);

    const isSuccess = simulateSuccess === undefined ? true : Boolean(simulateSuccess);

    if (isSuccess) {
      await payment.update({ status: 'captured', capturedAt: new Date() }, { transaction });
      const nextOrderStatus = order.isRecipientChoice ? 'awaiting_recipient' : 'paid';
      const previousStatus = order.status;
      await order.update(
        {
          paymentStatus: 'paid',
          status: nextOrderStatus,
        },
        { transaction },
      );

      await OrderStatusLog.create(
        {
          orderId: order.id,
          fromStatus: previousStatus,
          toStatus: nextOrderStatus,
          source: 'payment',
          note: 'Mock payment success',
        },
        { transaction },
      );
    } else {
      await payment.update({ status: 'failed' }, { transaction });
    }

    await transaction.commit();

    return res.status(201).json({
      success: true,
      message: isSuccess ? 'Mock payment processed successfully' : 'Mock payment failed',
      data: {
        payment,
        order,
      },
    });
  } catch (error) {
    await transaction.rollback();
    return handleControllerError(res, error, 500);
  }
};

const authorize = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { orderId, method, simulateSuccess, processingDelayMs } = req.body || {};

    const order = await Order.findByPk(orderId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!order) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.paymentStatus === 'paid') {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Order is already paid' });
    }

    const existingAuthorized = await Payment.findOne({
      where: { orderId: order.id, status: 'authorized' },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (existingAuthorized) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Order already has an active authorization hold' });
    }

    const payment = await Payment.create(
      {
        orderId: order.id,
        amount: Number(order.totalPrice),
        currency: order.currency,
        status: 'pending',
        method,
        transactionId: `AUTH-${uuidv4()}`,
      },
      { transaction },
    );

    const delayMs = Number.isInteger(Number(processingDelayMs))
      ? Math.max(0, Math.min(Number(processingDelayMs), 10000))
      : DEFAULT_DELAY_MS;

    await wait(delayMs);

    const isSuccess = simulateSuccess === undefined ? true : Boolean(simulateSuccess);

    if (isSuccess) {
      await payment.update({ status: 'authorized', authorizedAt: new Date() }, { transaction });

      if (order.paymentStatus !== 'paid') {
        await order.update({ paymentStatus: 'authorized' }, { transaction });
      }

      if (order.isRecipientChoice && order.status === 'pending') {
        await order.update({ status: 'awaiting_recipient' }, { transaction });
        await OrderStatusLog.create(
          {
            orderId: order.id,
            fromStatus: 'pending',
            toStatus: 'awaiting_recipient',
            source: 'payment',
            note: 'Payment authorized (hold placed) waiting for recipient decision',
          },
          { transaction },
        );
      }
    } else {
      await payment.update({ status: 'failed' }, { transaction });
    }

    await transaction.commit();

    return res.status(201).json({
      success: true,
      message: isSuccess ? 'Payment authorized (hold placed)' : 'Payment authorization failed',
      data: {
        payment,
      },
    });
  } catch (error) {
    await transaction.rollback();
    return handleControllerError(res, error, 500);
  }
};

const capture = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const paymentId = parsePositiveInt(req.params.id);
    if (!paymentId) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Payment id must be a positive integer' });
    }

    const payment = await Payment.findByPk(paymentId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!payment) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    if (payment.status !== 'authorized') {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Only authorized payments can be captured' });
    }

    const order = await Order.findByPk(payment.orderId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!order) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'Order not found for payment' });
    }

    await payment.update({ status: 'captured', capturedAt: new Date() }, { transaction });
    await order.update({ paymentStatus: 'paid' }, { transaction });

    await transaction.commit();

    return res.json({
      success: true,
      message: 'Payment captured successfully',
      data: { payment, order },
    });
  } catch (error) {
    await transaction.rollback();
    return handleControllerError(res, error, 500);
  }
};

const voidPayment = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const paymentId = parsePositiveInt(req.params.id);
    if (!paymentId) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Payment id must be a positive integer' });
    }

    const payment = await Payment.findByPk(paymentId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!payment) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    if (payment.status !== 'authorized') {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Only authorized payments can be voided' });
    }

    const order = await Order.findByPk(payment.orderId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!order) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'Order not found for payment' });
    }

    await payment.update({ status: 'voided', voidedAt: new Date() }, { transaction });
    await order.update({ paymentStatus: 'voided' }, { transaction });

    await transaction.commit();

    return res.json({
      success: true,
      message: 'Payment authorization voided successfully',
      data: { payment, order },
    });
  } catch (error) {
    await transaction.rollback();
    return handleControllerError(res, error, 500);
  }
};

const refund = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const paymentId = parsePositiveInt(req.params.id);
    if (!paymentId) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Payment id must be a positive integer' });
    }

    const payment = await Payment.findByPk(paymentId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!payment) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    if (!['captured', 'success'].includes(payment.status)) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Only captured payments can be refunded' });
    }

    const order = await Order.findByPk(payment.orderId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!order) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'Order not found for payment' });
    }

    await payment.update({ status: 'refunded', refundedAt: new Date() }, { transaction });
    await order.update({ paymentStatus: 'refunded' }, { transaction });

    await transaction.commit();

    return res.json({
      success: true,
      message: 'Payment refunded successfully',
      data: { payment, order },
    });
  } catch (error) {
    await transaction.rollback();
    return handleControllerError(res, error, 500);
  }
};

const getAllAdmin = async (req, res) => {
  try {
    const page = parsePositiveInt(req.query.page) || 1;
    const limit = parsePositiveInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const where = {};

    if (req.query.status !== undefined) {
      where.status = String(req.query.status).trim();
    }

    if (req.query.method !== undefined) {
      where.method = String(req.query.method).trim();
    }

    if (req.query.orderId !== undefined) {
      const orderId = parsePositiveInt(req.query.orderId);
      if (!orderId) {
        return res.status(400).json({ success: false, message: 'orderId must be a positive integer' });
      }
      where.orderId = orderId;
    }

    if (req.query.isRefunded !== undefined) {
      const parsed = parseBooleanLike(req.query.isRefunded);
      if (parsed === undefined) {
        return res.status(400).json({ success: false, message: 'isRefunded must be boolean-like' });
      }
      where.status = parsed ? 'refunded' : where.status;
    }

    const { count, rows } = await Payment.findAndCountAll({
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
        payments: rows,
      },
    });
  } catch (error) {
    return handleControllerError(res, error, 500);
  }
};

const getOneAdmin = async (req, res) => {
  try {
    const paymentId = parsePositiveInt(req.params.id);
    if (!paymentId) {
      return res.status(400).json({ success: false, message: 'Payment id must be a positive integer' });
    }

    const payment = await Payment.findByPk(paymentId, {
      include: [{ model: Order, as: 'order' }],
    });

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    return res.json({ success: true, data: payment });
  } catch (error) {
    return handleControllerError(res, error, 500);
  }
};

module.exports = {
  pay,
  authorize,
  capture,
  voidPayment,
  refund,
  getAllAdmin,
  getOneAdmin,
  captureAuthorizedPaymentForOrder,
  voidAuthorizedPaymentForOrder,
};
