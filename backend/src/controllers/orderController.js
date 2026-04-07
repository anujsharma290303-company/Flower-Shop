const { Order, OrderItem, Product, RecipentAccessToken, OrderStatusLog, NotificationLog, CreditTransaction, User, sequelize } = require('../models');
const { v4: uuidv4 } = require('uuid');

const ORDER_STATUS = ['pending', 'paid', 'awaiting_recipient', 'recipient_accepted', 'processing', 'out_for_delivery', 'delivered', 'cancelled'];
const PAYMENT_STATUS = ['unpaid', 'paid', 'refunded'];

const handleControllerError = (res, error, defaultCode = 500) => {
  console.error('[OrderController Error]', error);
  const status = error.statusCode || defaultCode;
  const message = error.message || 'Internal server error';
  return res.status(status).json({ success: false, message });
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

const parsePositiveInt = (value) => {
  const numberValue = Number(value);
  if (!Number.isInteger(numberValue) || numberValue <= 0) {
    return null;
  }
  return numberValue;
};

const buildRecipientLink = (token) => {
  if (!token) return null;
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  return `${baseUrl.replace(/\/$/, '')}/recipient/${token}`;
};

const logStatusTransition = async ({ orderId, fromStatus, toStatus, source, note, transaction }) => {
  return OrderStatusLog.create(
    {
      orderId,
      fromStatus: fromStatus || null,
      toStatus,
      source: source || 'system',
      note: note || null,
    },
    transaction ? { transaction } : undefined,
  );
};

const scheduleLifecycleSimulation = (orderId) => {
  setTimeout(async () => {
    try {
      const order = await Order.findByPk(orderId);
      if (!order || order.status === 'cancelled' || order.status === 'delivered') return;
      if (order.status === 'processing') {
        const fromStatus = order.status;
        await order.update({ status: 'out_for_delivery' });
        await logStatusTransition({
          orderId: order.id,
          fromStatus,
          toStatus: 'out_for_delivery',
          source: 'system',
          note: 'Auto simulation step',
        });
      }
    } catch (error) {
      console.error('[OrderController Simulation Error]', error.message);
    }
  }, 5000);

  setTimeout(async () => {
    try {
      const order = await Order.findByPk(orderId);
      if (!order || order.status === 'cancelled' || order.status === 'delivered') return;
      if (order.status === 'out_for_delivery') {
        const fromStatus = order.status;
        await order.update({ status: 'delivered' });
        await logStatusTransition({
          orderId: order.id,
          fromStatus,
          toStatus: 'delivered',
          source: 'system',
          note: 'Auto simulation step',
        });
      }
    } catch (error) {
      console.error('[OrderController Simulation Error]', error.message);
    }
  }, 10000);
};

const create = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      recipientName,
      recipientEmail,
      recipientPhone,
      deliveryAddress,
      deliveryDate,
      deliveryMode,
      message,
      isSubscription,
      subscriptionFrequency,
      isRecipientChoice,
      creditsToUse,
      items,
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Items must be a non-empty array' });
    }

    const productIds = items.map((item) => parsePositiveInt(item.productId)).filter(Boolean);
    if (productIds.length !== items.length) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Each item must include a valid productId' });
    }

    const products = await Product.findAll({
      where: { id: productIds },
      transaction,
    });

    if (products.length !== productIds.length) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'One or more products were not found' });
    }

    const productMap = new Map(products.map((product) => [product.id, product]));

    const normalizedItems = items.map((item) => {
      const quantity = parsePositiveInt(item.quantity);
      if (!quantity) {
        return { error: 'Each item must include a positive integer quantity' };
      }

      const product = productMap.get(Number(item.productId));
      const priceAtPurchase = Number(product.price);

      return {
        product,
        productId: product.id,
        productName: product.name,
        productImage: Array.isArray(product.image) ? (product.image[0] || null) : null,
        quantity,
        priceAtPurchase,
      };
    });

    const firstError = normalizedItems.find((item) => item.error);
    if (firstError) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: firstError.error });
    }

    const subtotal = normalizedItems.reduce((sum, item) => sum + (item.priceAtPurchase * item.quantity), 0);

    const parsedCreditsToUse = Number.isInteger(Number(creditsToUse)) ? Math.max(0, Number(creditsToUse)) : 0;
    let creditsApplied = 0;
    let userId = null;

    if (parsedCreditsToUse > 0) {
      if (!req.user?.id) {
        await transaction.rollback();
        return res.status(401).json({ success: false, message: 'Customer login required to apply credits' });
      }

      const user = await User.findByPk(req.user.id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!user) {
        await transaction.rollback();
        return res.status(404).json({ success: false, message: 'User not found for credit usage' });
      }

      if (Number(user.credits) < parsedCreditsToUse) {
        await transaction.rollback();
        return res.status(400).json({ success: false, message: 'Insufficient credit balance' });
      }

      userId = user.id;
      creditsApplied = Math.min(parsedCreditsToUse, Math.floor(subtotal));
      await user.update({ credits: Number(user.credits) - creditsApplied }, { transaction });
    } else if (req.user?.id) {
      userId = req.user.id;
    }

    const totalPrice = Math.max(0, subtotal - creditsApplied);
    const normalizedDeliveryMode = ['recipient-provides', 'sender-provides', 'social-media'].includes(deliveryMode)
      ? deliveryMode
      : 'recipient-provides';

    if (normalizedDeliveryMode === 'sender-provides' && (!deliveryAddress || !String(deliveryAddress).trim())) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'deliveryAddress is required when deliveryMode is sender-provides' });
    }

    const order = await Order.create(
      {
        customerName,
        customerEmail,
        customerPhone,
        userId,
        recipientName,
        recipientEmail: recipientEmail || null,
        recipientPhone,
        deliveryAddress,
        deliveryDate: deliveryDate || null,
        deliveryMode: normalizedDeliveryMode,
        message: message || null,
        totalPrice: Number(totalPrice.toFixed(2)),
        creditsUsed: creditsApplied,
        isSubscription: Boolean(isSubscription),
        subscriptionFrequency: subscriptionFrequency || null,
        isRecipientChoice: Boolean(isRecipientChoice),
        status: 'pending',
        paymentStatus: 'unpaid',
      },
      { transaction },
    );

    await logStatusTransition({
      orderId: order.id,
      fromStatus: null,
      toStatus: order.status,
      source: 'system',
      note: 'Order created',
      transaction,
    });

    await OrderItem.bulkCreate(
      normalizedItems.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        quantity: item.quantity,
        priceAtPurchase: item.priceAtPurchase,
      })),
      { transaction },
    );

    let recipientToken = null;
    const shouldGenerateRecipientToken = Boolean(isRecipientChoice) && normalizedDeliveryMode !== 'sender-provides';
    if (shouldGenerateRecipientToken) {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 48);

      const tokenRecord = await RecipentAccessToken.create(
        {
          orderId: order.id,
          token: uuidv4(),
          expiresAt,
          status: 'pending',
          recipentName: recipientName,
          recipentEmail: recipientEmail || null,
        },
        { transaction },
      );

      recipientToken = tokenRecord.token;
    }

    if (creditsApplied > 0 && userId) {
      await CreditTransaction.create(
        {
          userId,
          orderId: order.id,
          amount: creditsApplied,
          type: 'redeem',
          reason: 'checkout_credit_applied',
        },
        { transaction }
      );
    }

    await transaction.commit();

    const fullOrder = await Order.findByPk(order.id, {
      include: [
        { model: OrderItem, as: 'items' },
      ],
    });

    const recipientLink = buildRecipientLink(recipientToken);

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order: fullOrder,
        recipientToken,
        recipientLink,
      },
    });
  } catch (error) {
    await transaction.rollback();
    return handleControllerError(res, error, 500);
  }
};

const getAllAdmin = async (req, res) => {
  try {
    const { status, paymentStatus } = req.query;
    const page = parsePositiveInt(req.query.page) || 1;
    const limit = parsePositiveInt(req.query.limit) || 20;

    if (status && !ORDER_STATUS.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status filter' });
    }

    if (paymentStatus && !PAYMENT_STATUS.includes(paymentStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid paymentStatus filter' });
    }

    const where = {};
    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;

    const offset = (page - 1) * limit;

    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [{ model: OrderItem, as: 'items' }],
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
        orders: rows,
      },
    });
  } catch (error) {
    return handleControllerError(res, error, 500);
  }
};

const getOne = async (req, res) => {
  try {
    const orderId = parsePositiveInt(req.params.id);
    if (!orderId) {
      return res.status(400).json({ success: false, message: 'Order id must be a positive integer' });
    }

    const order = await Order.findByPk(orderId, {
      include: [
        { model: OrderItem, as: 'items' },
        { model: RecipentAccessToken, as: 'recipentTokens' },
        { model: OrderStatusLog, as: 'statusLogs' },
      ],
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.json({ success: true, data: order });
  } catch (error) {
    return handleControllerError(res, error, 500);
  }
};

const updateStatus = async (req, res) => {
  try {
    const orderId = parsePositiveInt(req.params.id);
    if (!orderId) {
      return res.status(400).json({ success: false, message: 'Order id must be a positive integer' });
    }

    const { status, autoSimulate } = req.body || {};
    if (!status) {
      return res.status(400).json({ success: false, message: 'status is required in request body' });
    }

    if (!ORDER_STATUS.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const previousStatus = order.status;
    await order.update({ status });

    await logStatusTransition({
      orderId: order.id,
      fromStatus: previousStatus,
      toStatus: status,
      source: 'admin',
      note: autoSimulate === true && status === 'processing' ? 'Admin status update with auto simulation' : 'Admin status update',
    });

    if (status === 'processing' && autoSimulate === true) {
      scheduleLifecycleSimulation(order.id);
    }

    return res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order,
    });
  } catch (error) {
    return handleControllerError(res, error, 500);
  }
};

const updatePayment = async (req, res) => {
  try {
    const orderId = parsePositiveInt(req.params.id);
    if (!orderId) {
      return res.status(400).json({ success: false, message: 'Order id must be a positive integer' });
    }

    const { paymentStatus } = req.body || {};
    if (!paymentStatus) {
      return res.status(400).json({ success: false, message: 'paymentStatus is required in request body' });
    }

    if (!PAYMENT_STATUS.includes(paymentStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid payment status value' });
    }

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    await order.update({ paymentStatus });

    return res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: order,
    });
  } catch (error) {
    return handleControllerError(res, error, 500);
  }
};

const getRecipientLink = async (req, res) => {
  try {
    const orderId = parsePositiveInt(req.params.id);
    if (!orderId) {
      return res.status(400).json({ success: false, message: 'Order id must be a positive integer' });
    }

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (!order.isRecipientChoice) {
      return res.status(400).json({
        success: false,
        message: 'Recipient link is only available for recipient-choice orders',
      });
    }

    const tokenRecord = await RecipentAccessToken.findOne({
      where: { orderId },
      order: [
        ['status', 'ASC'],
        ['createdAt', 'DESC'],
      ],
    });

    if (!tokenRecord) {
      return res.status(404).json({ success: false, message: 'Recipient link not available for this order' });
    }

    const recipientLink = buildRecipientLink(tokenRecord.token);

    // Log recipient link generation
    console.log('\n═══════════════════════════════════════════════════');
    console.log('🔗 RECIPIENT LINK GENERATED');
    console.log('═══════════════════════════════════════════════════');
    console.log(`Order ID: ${orderId}`);
    console.log(`Recipient: ${order.recipientName} (${order.recipientEmail})`);
    console.log(`Token: ${tokenRecord.token}`);
    console.log(`Link: ${recipientLink}`);
    console.log(`Expires At: ${tokenRecord.expiresAt}`);
    console.log('═══════════════════════════════════════════════════\n');

    await logNotification(
      'recipient-link',
      'order-system',
      order.recipientEmail,
      `Recipient Link Generated for Order #${orderId}`,
      `Recipient ${order.recipientName} can now choose their flowers at: ${recipientLink}`,
      {
        orderId,
        recipientName: order.recipientName,
        recipientEmail: order.recipientEmail,
        token: tokenRecord.token,
        link: recipientLink,
        expiresAt: tokenRecord.expiresAt,
      }
    );

    return res.json({
      success: true,
      data: {
        orderId,
        token: tokenRecord.token,
        link: recipientLink,
        status: tokenRecord.status,
        expiresAt: tokenRecord.expiresAt,
      },
    });
  } catch (error) {
    return handleControllerError(res, error, 500);
  }
};

const getStatusTimeline = async (req, res) => {
  try {
    const orderId = parsePositiveInt(req.params.id);
    if (!orderId) {
      return res.status(400).json({ success: false, message: 'Order id must be a positive integer' });
    }

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const timeline = await OrderStatusLog.findAll({
      where: { orderId },
      order: [['createdAt', 'ASC']],
    });

    return res.json({
      success: true,
      data: {
        orderId,
        timeline,
      },
    });
  } catch (error) {
    return handleControllerError(res, error, 500);
  }
};

module.exports = {
  create,
  getAllAdmin,
  getOne,
  getRecipientLink,
  getStatusTimeline,
  updateStatus,
  updatePayment,
};
