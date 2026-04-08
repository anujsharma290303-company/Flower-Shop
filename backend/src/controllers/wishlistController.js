const slugify = require('slugify');
const { Wishlist } = require('../models');

const handleControllerError = (res, error, defaultCode = 500) => {
  console.error('[WishlistController Error]', error);
  const status = error.statusCode || defaultCode;
  const message = error.message || 'Internal server error';
  return res.status(status).json({ success: false, message });
};

const create = async (req, res) => {
  try {
    const { slug, isPublic } = req.body || {};

    const baseSlug = slugify(String(slug || `wishlist-${Date.now()}`).trim(), { lower: true, strict: true, trim: true })
      || `wishlist-${Date.now()}`;
    let candidate = baseSlug;

    let suffix = 2;
    while (await Wishlist.findOne({ where: { slug: candidate } })) {
      candidate = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    const wishlist = await Wishlist.create({
      userId: req.user.id,
      slug: candidate,
      isPublic: typeof isPublic === 'boolean' ? isPublic : true,
    });

    return res.status(201).json({
      success: true,
      message: 'Wishlist created',
      data: {
        id: wishlist.id,
        token: wishlist.token,
        slug: wishlist.slug,
        isPublic: wishlist.isPublic,
      },
    });
  } catch (error) {
    return handleControllerError(res, error, 500);
  }
};

const getMine = async (req, res) => {
  try {
    const list = await Wishlist.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });

    return res.json({ success: true, data: list });
  } catch (error) {
    return handleControllerError(res, error, 500);
  }
};

const getByToken = async (req, res) => {
  try {
    const token = String(req.params.token || '').trim();
    if (!token) {
      return res.status(400).json({ success: false, message: 'token is required' });
    }

    const wishlist = await Wishlist.findOne({ where: { token, isPublic: true } });
    if (!wishlist) {
      return res.status(404).json({ success: false, message: 'Wishlist not found' });
    }

    return res.json({
      success: true,
      data: {
        token: wishlist.token,
        slug: wishlist.slug,
      },
    });
  } catch (error) {
    return handleControllerError(res, error, 500);
  }
};

module.exports = {
  create,
  getMine,
  getByToken,
};
