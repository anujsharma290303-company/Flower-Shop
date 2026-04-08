const { RecipentAccessToken, Order, OrderItem, OrderStatusLog, Product, Category, NotificationLog, sequelize } = require('../models');
const { captureAuthorizedPaymentForOrder, voidAuthorizedPaymentForOrder } = require('./paymentController');

const handleControllerError = (res, error, defaultCode = 500) => {
  console.error('[RecipientController Error]', error);
  const status = error.statusCode || defaultCode;
  const message = error.message || 'Internal server error';
  return res.status(status).json({ success: false, message });
};

const isExpired = (expiresAt) => new Date() > new Date(expiresAt);

const isValidDeliveryDate = (dateString) => {
  if (!dateString || typeof dateString !== 'string') return false;
  const date = new Date(`${dateString}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return false;

  const today = new Date();
  const todayStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  if (date < todayStart) return false;

  // Sunday is not deliverable.
  if (date.getUTCDay() === 0) return false;
  return true;
};

const logNotification = async (type, source, recipient, subject, message, metadata = {}) => {
  try {
    await NotificationLog.create({
      type,
      source,
      recipient,
      subject,
      message,
      metadata,
      status: 'logged',
    });
  } catch (error) {
    console.error('[LogNotification] Failed to save notification log:', error.message);
  }
};

const getByToken = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token || typeof token !== 'string' || !token.trim()) {
      return res.status(400).json({ success: false, message: 'Valid token is required' });
    }

    const record = await RecipentAccessToken.findOne({
      where: { token: token.trim() },
      include: [{ model: Order, as: 'order' }],
    });

    if (!record) {
      return res.status(404).json({ success: false, message: 'Invalid recipient link' });
    }

    if (record.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `This link has already been ${record.status}`,
        status: record.status,
      });
    }

    if (isExpired(record.expiresAt)) {
      return res.status(400).json({ success: false, message: 'This recipient link has expired' });
    }

    const budget = Number(record.order.totalPrice);
    const products = await Product.findAll({
      where: { inStock: true },
      include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }],
      order: [['isBestSeller', 'DESC'], ['createdAt', 'DESC']],
      limit: 50,
    });

    const productsWithBudgetFlag = products.map((product) => {
      const price = Number(product.price);
      return {
        ...product.toJSON(),
        withinBudget: Number.isFinite(price) ? price <= budget : false,
      };
    });

    return res.json({
      success: true,
      data: {
        token: record.token,
        recipientName: record.recipentName,
        budget,
        expiresAt: record.expiresAt,
        products: productsWithBudgetFlag,
      },
    });
  } catch (error) {
    return handleControllerError(res, error, 500);
  }
};

const accept = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      token,
      chosenProductId,
      deliveryAddress,
      deliveryDate,
      chosenDeliveryDate,
    } = req.body || {};
    const resolvedDeliveryDate = deliveryDate || chosenDeliveryDate;

    if (!token || !chosenProductId || !deliveryAddress || !resolvedDeliveryDate) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'token, chosenProductId, deliveryAddress and deliveryDate are required',
      });
    }

    if (!isValidDeliveryDate(resolvedDeliveryDate)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'deliveryDate must be a valid non-Sunday date (today or future)',
      });
    }

    const record = await RecipentAccessToken.findOne({
      where: { token },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!record) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'Invalid token' });
    }

    if (record.status !== 'pending') {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: `Token already ${record.status}` });
    }

    if (isExpired(record.expiresAt)) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Token has expired' });
    }

    const product = await Product.findByPk(chosenProductId, { transaction });
    if (!product) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (!product.inStock) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Selected product is out of stock' });
    }

    await record.update(
      {
        status: 'accepted',
        choosenProductId: Number(chosenProductId),
        chosenDeliveryDate: resolvedDeliveryDate,
        chosenDeliveryAddress: deliveryAddress,
        acceptedAt: new Date(),
        declinedAt: null,
      },
      { transaction },
    );

    const order = await Order.findByPk(record.orderId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!order) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'Related order not found for token' });
    }

    // Keep order line items consistent with the recipient's chosen product.
    await OrderItem.destroy({ where: { orderId: order.id }, transaction });
    await OrderItem.create(
      {
        orderId: order.id,
        productId: product.id,
        productName: product.name,
        productImage: Array.isArray(product.image) ? (product.image[0] || null) : null,
        quantity: 1,
        priceAtPurchase: product.price,
      },
      { transaction },
    );

    const previousStatus = order.status;

    await order.update(
      {
        deliveryAddress,
        deliveryDate: resolvedDeliveryDate,
        paymentStatus: (await captureAuthorizedPaymentForOrder(order.id, transaction)).captured ? 'paid' : order.paymentStatus,
        status: 'recipient_accepted',
      },
      { transaction },
    );

    await OrderStatusLog.create(
      {
        orderId: order.id,
        fromStatus: previousStatus,
        toStatus: 'recipient_accepted',
        source: 'recipient',
        note: 'Recipient accepted flower choice',
      },
      { transaction },
    );

    await transaction.commit();

    // Log recipient acceptance
    console.log('\n═══════════════════════════════════════════════════');
    console.log('✅ RECIPIENT ACCEPTED FLOWERS');
    console.log('═══════════════════════════════════════════════════');
    console.log(`Order ID: ${order.id}`);
    console.log(`Recipient: ${order.recipientName} (${order.recipientEmail})`);
    console.log(`Chosen Product: ${product.name} (ID: ${product.id})`);
    console.log(`Delivery Date: ${resolvedDeliveryDate}`);
    console.log(`Delivery Address: ${deliveryAddress}`);
    console.log('═══════════════════════════════════════════════════\n');

    await logNotification(
      'recipient-accepted',
      'recipient-flow',
      order.recipientEmail,
      `Flowers Accepted for Order #${order.id}`,
      `${order.recipientName} has accepted and chosen: ${product.name}. Delivery date: ${resolvedDeliveryDate}. Delivery address: ${deliveryAddress}`,
      {
        orderId: order.id,
        recipientName: order.recipientName,
        recipientEmail: order.recipientEmail,
        chosenProductId: product.id,
        chosenProductName: product.name,
        chosenDeliveryDate: resolvedDeliveryDate,
        deliveryAddress,
        acceptedAt: new Date().toISOString(),
      }
    );

    return res.json({
      success: true,
      message: 'Flowers accepted! Your order has been accepted by recipient.',
      data: {
        orderId: order.id,
        chosenProductId: Number(chosenProductId),
      },
    });
  } catch (error) {
    await transaction.rollback();
    return handleControllerError(res, error, 500);
  }
};

const reject = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { token } = req.body || {};
    if (!token || typeof token !== 'string' || !token.trim()) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Token is required' });
    }

    const record = await RecipentAccessToken.findOne({
      where: { token: token.trim() },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!record) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'Invalid token' });
    }

    if (record.status !== 'pending') {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: `Token already ${record.status}` });
    }

    await record.update({ status: 'declined', declinedAt: new Date() }, { transaction });
    const order = await Order.findByPk(record.orderId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!order) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'Related order not found for token' });
    }

    await order.update({ status: 'cancelled' }, { transaction });
    const voidResult = await voidAuthorizedPaymentForOrder(order.id, transaction);
    if (voidResult.voided) {
      await order.update({ paymentStatus: 'unpaid' }, { transaction });
    }

    await transaction.commit();

    // Log recipient rejection
    console.log('\n═══════════════════════════════════════════════════');
    console.log('❌ RECIPIENT DECLINED FLOWERS');
    console.log('═══════════════════════════════════════════════════');
    console.log(`Order ID: ${order.id}`);
    console.log(`Recipient: ${order.recipientName} (${order.recipientEmail})`);
    console.log('Order Status: Cancelled');
    console.log('═══════════════════════════════════════════════════\n');

    await logNotification(
      'recipient-accepted',
      'recipient-flow',
      order.recipientEmail,
      `Flowers Declined for Order #${order.id}`,
      `${order.recipientName} has declined the flowers. Order has been cancelled.`,
      {
        orderId: order.id,
        recipientName: order.recipientName,
        recipientEmail: order.recipientEmail,
        declinedAt: new Date().toISOString(),
        status: 'cancelled',
      }
    );

    return res.json({
      success: true,
      message: 'Order declined successfully.',
      data: { orderId: order.id },
    });
  } catch (error) {
    await transaction.rollback();
    return handleControllerError(res, error, 500);
  }
};

module.exports = {
  getByToken,
  accept,
  reject,
};
