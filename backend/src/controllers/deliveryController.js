const { DeliveryBlackoutDate } = require('../models');
const { Op } = require('sequelize');

const DEFAULT_BLACKOUT_DATES = ['2026-01-01', '2026-12-25'];

const SCHEDULABLE_DAYS_AHEAD = 30;
const MAX_AVAILABLE_DATE_RESULTS = 30;

const parseBlackoutDates = () => {
  const envDates = String(process.env.DELIVERY_BLACKOUT_DATES || '')
    .split(',')
    .map((d) => d.trim())
    .filter(Boolean);

  return new Set([...DEFAULT_BLACKOUT_DATES, ...envDates]);
};

const toDateOnly = (date) => date.toISOString().slice(0, 10);

const isSunday = (date) => date.getUTCDay() === 0;

const isIsoDateOnly = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value || '').trim());

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

const getMergedBlackoutDateSet = async () => {
  const staticDates = parseBlackoutDates();
  const dbDates = await DeliveryBlackoutDate.findAll({
    where: { isActive: true },
    attributes: ['date'],
    order: [['date', 'ASC']],
  });

  for (const item of dbDates) {
    if (item.date) {
      staticDates.add(String(item.date));
    }
  }

  return staticDates;
};

const isUSZip = (zipCode) => /^\d{5}(?:-\d{4})?$/.test(zipCode);
const isCanadaPostal = (zipCode) => /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(zipCode);

const checkAvailability = async (req, res) => {
  try {
    const { zipCode, country } = req.query || {};

    if (!zipCode || !country) {
      return res.status(400).json({ success: false, message: 'zipCode and country are required query params' });
    }

    const normalizedCountry = String(country).trim().toUpperCase();
    const normalizedZip = String(zipCode).trim();

    let available = false;
    if (normalizedCountry === 'US' || normalizedCountry === 'USA' || normalizedCountry === 'UNITED STATES') {
      available = isUSZip(normalizedZip);
    } else if (normalizedCountry === 'CA' || normalizedCountry === 'CAN' || normalizedCountry === 'CANADA') {
      available = isCanadaPostal(normalizedZip);
    }

    return res.json({
      success: true,
      data: {
        zipCode: normalizedZip,
        country: normalizedCountry,
        available,
      },
    });
  } catch (error) {
    console.error('[DeliveryController] checkAvailability error:', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getAvailableDates = async (req, res) => {
  try {
    const { zipCode, state } = req.query || {};

    if (!zipCode || !state) {
      return res.status(400).json({ success: false, message: 'zipCode and state are required query params' });
    }

    const blackoutDates = await getMergedBlackoutDateSet();
    const daysToScan = SCHEDULABLE_DAYS_AHEAD;
    const maxResults = MAX_AVAILABLE_DATE_RESULTS;
    const now = new Date();
    const candidates = [];

    for (let i = 1; i <= daysToScan; i += 1) {
      const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + i));
      const dateOnly = toDateOnly(d);

      if (isSunday(d)) continue;
      if (blackoutDates.has(dateOnly)) continue;

      candidates.push(dateOnly);
      if (candidates.length >= maxResults) break;
    }

    return res.json({
      success: true,
      data: {
        zipCode: String(zipCode),
        state: String(state),
        rules: {
          sundaysAvailable: false,
          schedulableDaysAhead: SCHEDULABLE_DAYS_AHEAD,
          blackoutDates: [...blackoutDates],
        },
        availableDates: candidates,
      },
    });
  } catch (error) {
    console.error('[DeliveryController] getAvailableDates error:', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getBlackoutDatesAdmin = async (req, res) => {
  try {
    const page = parsePositiveInt(req.query.page) || 1;
    const limit = parsePositiveInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    const where = {};

    if (req.query.isActive !== undefined) {
      const isActive = parseBooleanLike(req.query.isActive);
      if (isActive === undefined) {
        return res.status(400).json({ success: false, message: 'isActive must be boolean-like' });
      }
      where.isActive = isActive;
    }

    if (req.query.fromDate !== undefined) {
      if (!isIsoDateOnly(req.query.fromDate)) {
        return res.status(400).json({ success: false, message: 'fromDate must be in YYYY-MM-DD format' });
      }
      where.date = where.date || {};
      where.date[Op.gte] = String(req.query.fromDate);
    }

    if (req.query.toDate !== undefined) {
      if (!isIsoDateOnly(req.query.toDate)) {
        return res.status(400).json({ success: false, message: 'toDate must be in YYYY-MM-DD format' });
      }
      where.date = where.date || {};
      where.date[Op.lte] = String(req.query.toDate);
    }

    const { count, rows } = await DeliveryBlackoutDate.findAndCountAll({
      where,
      order: [['date', 'ASC']],
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
        blackoutDates: rows,
      },
    });
  } catch (error) {
    console.error('[DeliveryController] getBlackoutDatesAdmin error:', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const createBlackoutDateAdmin = async (req, res) => {
  try {
    const { date, reason, isActive } = req.body || {};

    if (!date || !isIsoDateOnly(date)) {
      return res.status(400).json({ success: false, message: 'date is required in YYYY-MM-DD format' });
    }

    const exists = await DeliveryBlackoutDate.findOne({ where: { date: String(date) } });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Blackout date already exists' });
    }

    const parsedIsActive = isActive === undefined ? true : parseBooleanLike(isActive);
    if (parsedIsActive === undefined) {
      return res.status(400).json({ success: false, message: 'isActive must be boolean-like' });
    }

    const created = await DeliveryBlackoutDate.create({
      date: String(date),
      reason: reason ? String(reason).trim() : null,
      isActive: parsedIsActive,
    });

    return res.status(201).json({
      success: true,
      message: 'Delivery blackout date created successfully',
      data: created,
    });
  } catch (error) {
    console.error('[DeliveryController] createBlackoutDateAdmin error:', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const updateBlackoutDateAdmin = async (req, res) => {
  try {
    const blackoutId = parsePositiveInt(req.params.id);
    if (!blackoutId) {
      return res.status(400).json({ success: false, message: 'Blackout date id must be a positive integer' });
    }

    const record = await DeliveryBlackoutDate.findByPk(blackoutId);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Blackout date not found' });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, message: 'At least one field is required to update' });
    }

    const payload = {};

    if (req.body.date !== undefined) {
      if (!isIsoDateOnly(req.body.date)) {
        return res.status(400).json({ success: false, message: 'date must be in YYYY-MM-DD format' });
      }

      const existing = await DeliveryBlackoutDate.findOne({ where: { date: String(req.body.date) } });
      if (existing && existing.id !== record.id) {
        return res.status(409).json({ success: false, message: 'Another blackout date with this date already exists' });
      }

      payload.date = String(req.body.date);
    }

    if (req.body.reason !== undefined) {
      payload.reason = req.body.reason === '' || req.body.reason === null ? null : String(req.body.reason).trim();
    }

    if (req.body.isActive !== undefined) {
      const parsedIsActive = parseBooleanLike(req.body.isActive);
      if (parsedIsActive === undefined) {
        return res.status(400).json({ success: false, message: 'isActive must be boolean-like' });
      }
      payload.isActive = parsedIsActive;
    }

    await record.update(payload);

    return res.json({
      success: true,
      message: 'Delivery blackout date updated successfully',
      data: record,
    });
  } catch (error) {
    console.error('[DeliveryController] updateBlackoutDateAdmin error:', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const deleteBlackoutDateAdmin = async (req, res) => {
  try {
    const blackoutId = parsePositiveInt(req.params.id);
    if (!blackoutId) {
      return res.status(400).json({ success: false, message: 'Blackout date id must be a positive integer' });
    }

    const record = await DeliveryBlackoutDate.findByPk(blackoutId);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Blackout date not found' });
    }

    await record.destroy();

    return res.json({ success: true, message: 'Delivery blackout date deleted successfully' });
  } catch (error) {
    console.error('[DeliveryController] deleteBlackoutDateAdmin error:', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  getAvailableDates,
  checkAvailability,
  getBlackoutDatesAdmin,
  createBlackoutDateAdmin,
  updateBlackoutDateAdmin,
  deleteBlackoutDateAdmin,
};
