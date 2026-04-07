const { Order, OrderMedia, User, CreditTransaction, sequelize } = require('../models');

const ALLOWED_MEDIA_TYPES = ['photo', 'video'];
const ALLOWED_SHARED_WITH = ['sender', 'public'];
const CREDIT_REWARDS = {
  photo: 5,
  video: 10,
};

const handleControllerError = (res, error, context) => {
  console.error(`[OrderMediaController] ${context}:`, error.message);
  return res.status(500).json({ success: false, message: 'Internal server error' });
};

const parsePositiveId = (value) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }
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

const detectMediaType = (file) => {
  if (!file || !file.mimetype) {
    return null;
  }

  if (file.mimetype.startsWith('image/')) {
    return 'photo';
  }

  if (file.mimetype.startsWith('video/')) {
    return 'video';
  }

  return null;
};

const resolveMediaUrl = (file) => file?.path || file?.location || file?.secure_url || file?.url || file?.filename || null;

const create = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const orderId = parsePositiveId(req.params.id);
    const userId = req.user?.id;
    const sharedWithInput = typeof req.body?.sharedWith === 'string' ? req.body.sharedWith.trim().toLowerCase() : 'public';
    const mediaTypeInput = typeof req.body?.mediaType === 'string' ? req.body.mediaType.trim().toLowerCase() : null;

    if (!orderId) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Order id must be a positive integer' });
    }

    if (!ALLOWED_SHARED_WITH.includes(sharedWithInput)) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: `sharedWith must be one of: ${ALLOWED_SHARED_WITH.join(', ')}` });
    }

    const order = await Order.findByPk(orderId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!order) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (userId && order.userId && order.userId !== userId) {
      await transaction.rollback();
      return res.status(403).json({ success: false, message: 'You are not allowed to add media to this order' });
    }

    if (order.status !== 'delivered') {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Media can only be shared after delivery is completed' });
    }

    if (!req.file) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'media file is required' });
    }

    const detectedMediaType = detectMediaType(req.file);
    const mediaType = mediaTypeInput || detectedMediaType;
    if (!ALLOWED_MEDIA_TYPES.includes(mediaType)) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: `mediaType must be one of: ${ALLOWED_MEDIA_TYPES.join(', ')}` });
    }

    if (mediaTypeInput && mediaTypeInput !== detectedMediaType) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'mediaType does not match the uploaded file type' });
    }

    const mediaUrl = resolveMediaUrl(req.file);
    if (!mediaUrl) {
      await transaction.rollback();
      return res.status(500).json({ success: false, message: 'Unable to determine uploaded media URL' });
    }

    const mediaOwnerUserId = userId || order.userId || null;

    const orderMedia = await OrderMedia.create(
      {
        orderId: order.id,
        userId: mediaOwnerUserId,
        mediaUrl,
        mediaType,
        sharedWith: sharedWithInput,
        isApproved: false,
      },
      { transaction }
    );

    await transaction.commit();

    return res.status(201).json({
      success: true,
      message: 'Order media uploaded successfully',
      data: orderMedia,
    });
  } catch (error) {
    await transaction.rollback();
    return handleControllerError(res, error, 'Create order media error');
  }
};

const getAllAdmin = async (req, res) => {
  try {
    const { orderId, userId, mediaType, sharedWith, isApproved } = req.query;
    const where = {};

    if (orderId !== undefined) {
      const parsedOrderId = parsePositiveId(orderId);
      if (!parsedOrderId) {
        return res.status(400).json({ success: false, message: 'orderId must be a positive integer' });
      }
      where.orderId = parsedOrderId;
    }

    if (userId !== undefined) {
      const parsedUserId = parsePositiveId(userId);
      if (!parsedUserId) {
        return res.status(400).json({ success: false, message: 'userId must be a positive integer' });
      }
      where.userId = parsedUserId;
    }

    if (mediaType !== undefined) {
      const normalizedMediaType = String(mediaType).trim().toLowerCase();
      if (!ALLOWED_MEDIA_TYPES.includes(normalizedMediaType)) {
        return res.status(400).json({ success: false, message: `mediaType must be one of: ${ALLOWED_MEDIA_TYPES.join(', ')}` });
      }
      where.mediaType = normalizedMediaType;
    }

    if (sharedWith !== undefined) {
      const normalizedSharedWith = String(sharedWith).trim().toLowerCase();
      if (!ALLOWED_SHARED_WITH.includes(normalizedSharedWith)) {
        return res.status(400).json({ success: false, message: `sharedWith must be one of: ${ALLOWED_SHARED_WITH.join(', ')}` });
      }
      where.sharedWith = normalizedSharedWith;
    }

    if (isApproved !== undefined) {
      const parsedIsApproved = parseBooleanLike(isApproved);
      if (parsedIsApproved === undefined) {
        return res.status(400).json({ success: false, message: 'isApproved must be boolean-like' });
      }
      where.isApproved = parsedIsApproved;
    }

    const media = await OrderMedia.findAll({
      where,
      include: [
        { model: Order, as: 'order' },
        { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.json({ success: true, data: media });
  } catch (error) {
    return handleControllerError(res, error, 'Get order media admin error');
  }
};

const approve = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const mediaId = parsePositiveId(req.params.id);
    if (!mediaId) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Media id must be a positive integer' });
    }

    const media = await OrderMedia.findByPk(mediaId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!media) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'Media not found' });
    }

    if (media.isApproved) {
      await transaction.rollback();
      return res.json({
        success: true,
        message: 'Media is already approved',
        data: media,
      });
    }

    const rewardAmount = CREDIT_REWARDS[media.mediaType] || 0;
    const linkedOrder = await Order.findByPk(media.orderId, {
      transaction,
      attributes: ['id', 'userId'],
    });

    const ownerUserId = media.userId || linkedOrder?.userId || null;
    const user = ownerUserId
      ? await User.findByPk(ownerUserId, {
          transaction,
          lock: transaction.LOCK.UPDATE,
        })
      : null;

    await media.update(
      {
        isApproved: true,
        approvedAt: new Date(),
      },
      { transaction }
    );

    let newBalance = null;
    let creditTransaction = null;

    if (user) {
      newBalance = Number(user.credits) + rewardAmount;
      await user.update({ credits: newBalance }, { transaction });

      creditTransaction = await CreditTransaction.create(
        {
          userId: user.id,
          orderId: media.orderId,
          amount: rewardAmount,
          type: 'earn',
          reason: media.mediaType === 'video' ? 'video_shared' : 'photo_shared',
        },
        { transaction }
      );
    }

    await transaction.commit();

    return res.json({
      success: true,
      message: 'Media approved successfully',
      data: {
        media,
        creditTransaction,
        rewardAmount,
        balance: newBalance,
      },
    });
  } catch (error) {
    await transaction.rollback();
    return handleControllerError(res, error, 'Approve order media error');
  }
};

module.exports = {
  create,
  getAllAdmin,
  approve,
};
