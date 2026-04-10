const { body, validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
      })),
    });
  }

  return next();
};

const validateUpdateSiteConfig = [
  (req, res, next) => {
    if ((!req.body || Object.keys(req.body).length === 0) && !req.file) {
      return res.status(422).json({
        message: 'Validation failed',
        errors: [{ field: 'body', message: 'At least one field is required to update site configuration' }],
      });
    }

    return next();
  },
  body('heroTitle')
    .optional({ nullable: true })
    .isString()
    .withMessage('Hero title must be a string')
    .trim()
    .isLength({ max: 255 })
    .withMessage('Hero title must be at most 255 characters long'),
  body('heroSubTitle')
    .optional({ nullable: true })
    .isString()
    .withMessage('Hero subtitle must be a string')
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Hero subtitle must be at most 1000 characters long'),
  body('heroCTA1')
    .optional({ nullable: true })
    .isString()
    .withMessage('CTA 1 must be a string')
    .trim()
    .isLength({ max: 100 })
    .withMessage('CTA 1 must be at most 100 characters long'),
  body('heroCTA2')
    .optional({ nullable: true })
    .isString()
    .withMessage('CTA 2 must be a string')
    .trim()
    .isLength({ max: 100 })
    .withMessage('CTA 2 must be at most 100 characters long'),
  body('flowerMeTitle')
    .optional({ nullable: true })
    .isString()
    .withMessage('FlowerMe title must be a string')
    .trim()
    .isLength({ max: 255 })
    .withMessage('FlowerMe title must be at most 255 characters long'),
  body('flowerMeDescription')
    .optional({ nullable: true })
    .isString()
    .withMessage('FlowerMe description must be a string')
    .trim()
    .isLength({ max: 1000 })
    .withMessage('FlowerMe description must be at most 1000 characters long'),
  body('flowerMeVideoUrl')
    .optional({ nullable: true })
    .isString()
    .withMessage('FlowerMe video URL must be a string')
    .trim()
    .isLength({ max: 500 })
    .withMessage('FlowerMe video URL must be at most 500 characters long'),
  body('flowerMeThumbnailUrl')
    .optional({ nullable: true })
    .isString()
    .withMessage('FlowerMe thumbnail URL must be a string')
    .trim()
    .isLength({ max: 500 })
    .withMessage('FlowerMe thumbnail URL must be at most 500 characters long'),
  body('customBouquetsHeading')
    .optional({ nullable: true })
    .isString()
    .withMessage('Custom bouquets heading must be a string')
    .trim()
    .isLength({ max: 255 })
    .withMessage('Custom bouquets heading must be at most 255 characters long'),
  body('recipientsChoiceImage')
    .optional({ nullable: true })
    .isString()
    .withMessage('Recipients choice image must be a string')
    .trim()
    .isLength({ max: 500 })
    .withMessage('Recipients choice image must be at most 500 characters long'),
  body('sendersChoiceImage')
    .optional({ nullable: true })
    .isString()
    .withMessage('Senders choice image must be a string')
    .trim()
    .isLength({ max: 500 })
    .withMessage('Senders choice image must be at most 500 characters long'),
  body('howItWorks')
    .optional({ nullable: true })
    .custom((value) => {
      if (typeof value === 'string') {
        try {
          JSON.parse(value);
        } catch (e) {
          throw new Error('How it works must be valid JSON if provided as string');
        }
      }
      return true;
    }),
  body('benefitsData')
    .optional({ nullable: true })
    .custom((value) => {
      if (typeof value === 'string') {
        try {
          JSON.parse(value);
        } catch (e) {
          throw new Error('Benefits data must be valid JSON if provided as string');
        }
      }
      return true;
    }),
  body('contactEmail')
    .optional({ nullable: true })
    .isEmail()
    .withMessage('Contact email must be a valid email')
    .trim()
    .normalizeEmail(),
  body('contactPhone')
    .optional({ nullable: true })
    .isString()
    .withMessage('Contact phone must be a string')
    .trim()
    .matches(/^[+]?[\d\s\-()]{7,}$/)
    .withMessage('Contact phone must be a valid phone number'),
  body('socialLinks')
    .optional({ nullable: true })
    .custom((value) => {
      if (typeof value === 'string') {
        try {
          JSON.parse(value);
        } catch (e) {
          throw new Error('Social links must be valid JSON if provided as string');
        }
      }
      return true;
    }),
  handleValidation,
];

module.exports = { validateUpdateSiteConfig, handleValidation };
