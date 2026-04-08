const slugify = require('slugify');
const { FlowerMeProfile, User } = require('../models');

const handleControllerError = (res, error, defaultCode = 500) => {
  console.error('[FlowerMeController Error]', error);
  const status = error.statusCode || defaultCode;
  const message = error.message || 'Internal server error';
  return res.status(status).json({ success: false, message });
};

const buildUniqueSlug = async (base) => {
  const normalizedBase = slugify(String(base || ''), { lower: true, strict: true, trim: true }) || `flowerme-${Date.now()}`;

  let candidate = normalizedBase;
  let counter = 2;

  while (await FlowerMeProfile.findOne({ where: { slug: candidate } })) {
    candidate = `${normalizedBase}-${counter}`;
    counter += 1;
  }

  return candidate;
};

const upsertMine = async (req, res) => {
  try {
    const {
      displayName,
      tagline,
      photoUrl,
      socialLink,
      followersCount,
      tier,
      wishlistNotes,
      slug,
      isActive,
    } = req.body || {};

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const existing = await FlowerMeProfile.findOne({ where: { userId: req.user.id } });

    const resolvedDisplayName = String(displayName || user.firstName || 'FlowerMe Member').trim();
    const allowedTiers = ['society', 'socialite', 'royale'];
    const resolvedTier = allowedTiers.includes(String(tier || existing?.tier || 'society'))
      ? String(tier || existing?.tier || 'society')
      : 'society';

    let resolvedSlug = String(slug || existing?.slug || '').trim();
    if (!resolvedSlug) {
      resolvedSlug = await buildUniqueSlug(resolvedDisplayName);
    } else {
      resolvedSlug = slugify(resolvedSlug, { lower: true, strict: true, trim: true });
      const collision = await FlowerMeProfile.findOne({ where: { slug: resolvedSlug } });
      if (collision && collision.userId !== req.user.id) {
        return res.status(409).json({ success: false, message: 'slug already in use' });
      }
    }

    const resolvedFollowersCount = Number.isInteger(Number(followersCount)) && Number(followersCount) >= 0
      ? Number(followersCount)
      : (existing?.followersCount || 0);

    const payload = {
      userId: req.user.id,
      slug: resolvedSlug,
      displayName: resolvedDisplayName,
      tagline: tagline || null,
      photoUrl: photoUrl || null,
      socialLink: socialLink || null,
      followersCount: resolvedFollowersCount,
      tier: resolvedTier,
      wishlistNotes: wishlistNotes || null,
      isActive: typeof isActive === 'boolean' ? isActive : true,
    };

    const profile = existing
      ? await existing.update(payload)
      : await FlowerMeProfile.create(payload);

    return res.json({
      success: true,
      message: existing ? 'FlowerMe profile updated' : 'FlowerMe profile created',
      data: profile,
    });
  } catch (error) {
    return handleControllerError(res, error, 500);
  }
};

const getMine = async (req, res) => {
  try {
    const profile = await FlowerMeProfile.findOne({ where: { userId: req.user.id } });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'FlowerMe profile not found' });
    }

    return res.json({ success: true, data: profile });
  } catch (error) {
    return handleControllerError(res, error, 500);
  }
};

const getBySlug = async (req, res) => {
  try {
    const slug = String(req.params.slug || '').trim().toLowerCase();
    if (!slug) {
      return res.status(400).json({ success: false, message: 'slug is required' });
    }

    const profile = await FlowerMeProfile.findOne({
      where: { slug, isActive: true },
      attributes: ['slug', 'displayName', 'tagline', 'photoUrl', 'socialLink', 'followersCount', 'tier', 'wishlistNotes'],
    });

    if (!profile) {
      return res.status(404).json({ success: false, message: 'FlowerMe profile not found' });
    }

    return res.json({ success: true, data: profile });
  } catch (error) {
    return handleControllerError(res, error, 500);
  }
};

module.exports = {
  upsertMine,
  getMine,
  getBySlug,
};
