const { Review, Order } = require('../models');

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

const handleControllerError = (res, error, defaultCode = 500) => {
  console.error('[ReviewController Error]', error);
  const status = error.statusCode || defaultCode;
  const message = error.message || 'Internal server error';
  return res.status(status).json({ success: false, message });
};

const parsePositiveId = (id) => {
  const value = Number(id);
  if (!Number.isInteger(value) || value <= 0) {
    return null;
  }
  return value;
};

// Public: only approved reviews
const getAll = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { isApproved: true },
      order: [['createdAt', 'DESC']],
    });

    return res.json({ success: true, data: reviews });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

// Public: create review (always starts as pending approval)
const create = async (req, res) => {
  try {
    const { name, location, message, rating, orderId } = req.body;

    const numericOrderId = Number(orderId);
    const order = await Order.findByPk(numericOrderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const existingReview = await Review.findOne({ where: { orderId: numericOrderId } });
    if (existingReview) {
      return res.status(409).json({ success: false, message: 'A review for this order already exists' });
    }

    const review = await Review.create({
      name,
      location: location || null,
      message,
      rating,
      orderId: numericOrderId,
      isApproved: false,
    });

    return res.status(201).json({
      success: true,
      message: 'Review submitted successfully and pending approval',
      data: review,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

// Admin: get all reviews, optional filter ?isApproved=true|false
const getAllAdmin = async (req, res) => {
  try {
    const { isApproved } = req.query;
    const where = {};

    if (isApproved !== undefined) {
      const parsed = parseBooleanLike(isApproved);
      if (parsed === undefined) {
        return res.status(400).json({ success: false, message: 'isApproved query must be boolean-like' });
      }
      where.isApproved = parsed;
    }

    const reviews = await Review.findAll({
      where,
      include: [
        {
          model: Order,
          as: 'order',
          attributes: ['id'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.json({ success: true, data: reviews });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

// Admin: approve review
const approve = async (req, res) => {
  try {
    const reviewId = parsePositiveId(req.params.id);
    if (!reviewId) {
      return res.status(400).json({ success: false, message: 'Review id must be a positive integer' });
    }

    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    await review.update({ isApproved: true });

    return res.json({
      success: true,
      message: 'Review approved successfully',
      data: review,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

// Admin: reject review
const reject = async (req, res) => {
  try {
    const reviewId = parsePositiveId(req.params.id);
    if (!reviewId) {
      return res.status(400).json({ success: false, message: 'Review id must be a positive integer' });
    }

    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    await review.update({ isApproved: false });

    return res.json({
      success: true,
      message: 'Review rejected successfully',
      data: review,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

// Admin: delete review
const remove = async (req, res) => {
  try {
    const reviewId = parsePositiveId(req.params.id);
    if (!reviewId) {
      return res.status(400).json({ success: false, message: 'Review id must be a positive integer' });
    }

    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    await review.destroy();

    return res.json({
      success: true,
      message: 'Review deleted successfully',
      data: { id: reviewId },
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

module.exports = {
  getAll,
  create,
  getAllAdmin,
  approve,
  reject,
  remove,
};
