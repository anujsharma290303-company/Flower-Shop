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

  await payment.update({ status: 'captured' }, { transaction });
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

  await payment.update({ status: 'voided' }, { transaction });
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
      await payment.update({ status: 'success' }, { transaction });
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
      await payment.update({ status: 'authorized' }, { transaction });

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

    await payment.update({ status: 'captured' }, { transaction });
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

    await payment.update({ status: 'voided' }, { transaction });
    await order.update({ paymentStatus: 'unpaid' }, { transaction });

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

module.exports = {
  pay,
  authorize,
  capture,
  voidPayment,
  captureAuthorizedPaymentForOrder,
  voidAuthorizedPaymentForOrder,
};
