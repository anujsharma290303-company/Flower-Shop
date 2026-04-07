const { v4: uuidv4 } = require('uuid');
const slugify = require('slugify');
const { Op } = require('sequelize');
const { Wishlist, User, sequelize } = require('../models');

const handleControllerError = (res, error, context) => {
  console.error(`[WishlistController] ${context}:`, error.message);
  return res.status(500).json({ success: false, message: 'Internal server error' });
};

const buildUniqueSlug = async (baseText, excludeId = null) => {
  const baseSlug = slugify(baseText || 'wishlist', { lower: true, strict: true, trim: true }) || 'wishlist';
  let candidate = baseSlug;
  let suffix = 1;

  while (true) {
    const where = { slug: candidate };
    if (excludeId) {
      where.id = { [Op.ne]: excludeId };
    }

    const existing = await Wishlist.findOne({ where, attributes: ['id'] });
    if (!existing) return candidate;

    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
};

const create = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const userId = req.user?.id;
    const { isPublic = true, slug } = req.body || {};

    if (!userId) {
      await transaction.rollback();
      return res.status(401).json({ success: false, message: 'Customer login required' });
    }

    const user = await User.findByPk(userId, { transaction });
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const customSlug = slug && String(slug).trim() ? String(slug).trim() : await buildUniqueSlug(`${user.firstName} ${user.lastName} wishlist`);
    const uniqueSlug = await buildUniqueSlug(customSlug);

    const wishlist = await Wishlist.create(
      {
        userId,
        isPublic: Boolean(isPublic),
        slug: uniqueSlug,
        token: uuidv4(),
      },
      { transaction }
    );

    await transaction.commit();

    return res.status(201).json({
      success: true,
      message: 'Wishlist created successfully',
      data: {
        wishlist,
        publicLink: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/wishlist/${wishlist.token}`,
      },
    });
  } catch (error) {
    await transaction.rollback();
    return handleControllerError(res, error, 'Create wishlist error');
  }
};

const getByToken = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token || !String(token).trim()) {
      return res.status(400).json({ success: false, message: 'Valid wishlist token is required' });
    }

    const wishlist = await Wishlist.findOne({
      where: { token: String(token).trim(), isPublic: true },
      include: [{ model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] }],
    });

    if (!wishlist) {
      return res.status(404).json({ success: false, message: 'Wishlist not found' });
    }

    return res.json({
      success: true,
      data: {
        wishlist,
        publicLink: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/wishlist/${wishlist.token}`,
      },
    });
  } catch (error) {
    return handleControllerError(res, error, 'Get wishlist error');
  }
};

module.exports = {
  create,
  getByToken,
};
