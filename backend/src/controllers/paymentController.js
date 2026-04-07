const { v4: uuidv4 } = require('uuid');
const { Payment, Order, sequelize } = require('../models');

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
      await order.update(
        {
          paymentStatus: 'paid',
          status: 'confirmed',
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

module.exports = {
  pay,
};
