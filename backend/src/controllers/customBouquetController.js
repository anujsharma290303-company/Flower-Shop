const { CustomBouquet, Order } = require('../models');

const BOUQUET_TYPES = ['sender', 'recipient'];

const handleControllerError = (res, error, defaultCode = 500) => {
  console.error('[BouquetController Error]', error);
  const status = error.statusCode || defaultCode;
  const message = error.message || 'Internal server error';
  return res.status(status).json({ success: false, message });
};

const parsePositiveInt = (value) => {
  const numberValue = Number(value);
  if (!Number.isInteger(numberValue) || numberValue <= 0) {
    return null;
  }
  return numberValue;
};

const create = async (req, res) => {
  try {
    const {
      type,
      pricePoint,
      colors,
      flowerTypes,
      containerStyle,
      occasion,
      extras,
      note,
      orderId,
    } = req.body || {};

    if (!type) {
      return res.status(400).json({ success: false, message: 'type is required' });
    }

    if (!BOUQUET_TYPES.includes(type)) {
      return res.status(400).json({ success: false, message: 'type must be sender or recipient' });
    }

    const numericPrice = Number(pricePoint);
    if (!Number.isFinite(numericPrice)) {
      return res.status(400).json({ success: false, message: 'pricePoint is required' });
    }

    if (numericPrice < 25) {
      return res.status(400).json({ success: false, message: 'pricePoint must be at least 25' });
    }

    let normalizedOrderId = null;
    if (orderId !== undefined && orderId !== null && orderId !== '') {
      normalizedOrderId = parsePositiveInt(orderId);
      if (!normalizedOrderId) {
        return res.status(400).json({ success: false, message: 'orderId must be a positive integer' });
      }

      const order = await Order.findByPk(normalizedOrderId);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
    }

    const bouquet = await CustomBouquet.create({
      type,
      pricePoint: Number(numericPrice.toFixed(2)),
      colors: Array.isArray(colors) ? colors : [],
      flowerTypes: Array.isArray(flowerTypes) ? flowerTypes : [],
      containerStyle: typeof containerStyle === 'string' ? containerStyle.trim() || null : null,
      occasion: typeof occasion === 'string' ? occasion.trim() || null : null,
      extras: Array.isArray(extras) ? extras : [],
      note: note || null,
      orderId: normalizedOrderId,
    });

    return res.status(201).json({
      success: true,
      message: 'Custom bouquet created successfully',
      data: bouquet,
    });
  } catch (error) {
    return handleControllerError(res, error, 500);
  }
};

const getAllAdmin = async (req, res) => {
  try {
    const { type } = req.query;
    const page = parsePositiveInt(req.query.page) || 1;
    const limit = parsePositiveInt(req.query.limit) || 20;

    if (type && !BOUQUET_TYPES.includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid type filter' });
    }

    const where = {};
    if (type) where.type = type;

    const offset = (page - 1) * limit;

    const { count, rows } = await CustomBouquet.findAndCountAll({
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
        bouquets: rows,
      },
    });
  } catch (error) {
    return handleControllerError(res, error, 500);
  }
};

const getOne = async (req, res) => {
  try {
    const bouquetId = parsePositiveInt(req.params.id);
    if (!bouquetId) {
      return res.status(400).json({ success: false, message: 'Bouquet id must be a positive integer' });
    }

    const bouquet = await CustomBouquet.findByPk(bouquetId, {
      include: [{ model: Order, as: 'order' }],
    });

    if (!bouquet) {
      return res.status(404).json({ success: false, message: 'Custom bouquet not found' });
    }

    return res.json({ success: true, data: bouquet });
  } catch (error) {
    return handleControllerError(res, error, 500);
  }
};

const remove = async (req, res) => {
  try {
    const bouquetId = parsePositiveInt(req.params.id);
    if (!bouquetId) {
      return res.status(400).json({ success: false, message: 'Bouquet id must be a positive integer' });
    }

    const bouquet = await CustomBouquet.findByPk(bouquetId);
    if (!bouquet) {
      return res.status(404).json({ success: false, message: 'Custom bouquet not found' });
    }

    await bouquet.destroy();

    return res.json({
      success: true,
      message: 'Custom bouquet deleted successfully',
    });
  } catch (error) {
    return handleControllerError(res, error, 500);
  }
};

module.exports = {
  create,
  getAllAdmin,
  getOne,
  remove,
};
