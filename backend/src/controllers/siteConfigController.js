const { SiteConfig } = require('../models');

const handleError = (res, error, context) => {
  console.error(`${context}:`, error.message);
  const status = error.statusCode || 500;
  res.status(status).json({ success: false, message: 'Internal server error' });
};

const safeJsonParse = (value) => {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (e) {
      throw new Error(`Invalid JSON: ${e.message}`);
    }
  }
  return value;
};

// GET /api/siteconfig — public
const get = async (req, res) => {
  try {
    let config = await SiteConfig.findOne();
    if (!config) {
      config = await SiteConfig.create({});
    }
    return res.json({ success: true, data: config });
  } catch (error) {
    handleError(res, error, 'Get SiteConfig error');
  }
};

// PUT /api/admin/siteconfig — admin update
const update = async (req, res) => {
  try {
    let config = await SiteConfig.findOne();
    if (!config) {
      config = await SiteConfig.create({});
    }

    const { heroTitle, heroSubTitle, heroCTA1, heroCTA2, howItWorks, benefitsData, contactEmail, contactPhone, socialLinks } = req.body;
    const heroImage = req.file ? req.file.path : undefined;

    const updates = {};
    if (heroTitle !== undefined) updates.heroTitle = heroTitle;
    if (heroSubTitle !== undefined) updates.heroSubTitle = heroSubTitle;
    if (heroCTA1 !== undefined) updates.heroCTA1 = heroCTA1;
    if (heroCTA2 !== undefined) updates.heroCTA2 = heroCTA2;
    if (howItWorks !== undefined) updates.howItWorks = safeJsonParse(howItWorks);
    if (benefitsData !== undefined) updates.benefitsData = safeJsonParse(benefitsData);
    if (contactEmail !== undefined) updates.contactEmail = contactEmail;
    if (contactPhone !== undefined) updates.contactPhone = contactPhone;
    if (socialLinks !== undefined) updates.socialLinks = safeJsonParse(socialLinks);
    if (heroImage !== undefined) updates.heroImage = heroImage;

    await config.update(updates);
    return res.json({ success: true, message: 'Site configuration updated successfully', data: config });
  } catch (error) {
    handleError(res, error, 'Update SiteConfig error');
  }
};

module.exports = { get, update };

