const { body, validationResult } = require('express-validator');

const parseBooleanLike = (value) => {
  if (typeof value === 'boolean') {
    return value;
  }

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

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  return next();
};

const validateFaq = [
  body('question')
    .notEmpty()
    .withMessage('Question is required')
    .isString()
    .withMessage('Question must be a string')
    .trim()
    .isLength({ max: 255 })
    .withMessage('Question must be at most 255 characters long'),
  body('answer')
    .notEmpty()
    .withMessage('Answer is required')
    .isString()
    .withMessage('Answer must be a string')
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Answer must be at most 1000 characters long'),
  body('displayOrder')
    .optional({ nullable: true })
    .customSanitizer((value) => {
      const numberValue = Number(value);
      return Number.isNaN(numberValue) ? value : numberValue;
    })
    .isInt({ min: 0 })
    .withMessage('Display order must be a non-negative integer'),
  body('isActive')
    .optional({ nullable: true })
    .customSanitizer((value) => parseBooleanLike(value))
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  handleValidation,
];

const validateUpdateFaq = [
  (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ errors: [{ message: 'At least one field is required to update FAQ' }] });
    }

    return next();
  },
  body('question')
    .optional({ nullable: true })
    .isString()
    .withMessage('Question must be a string')
    .trim()
    .isLength({ max: 255 })
    .withMessage('Question must be at most 255 characters long'),
  body('answer')
    .optional({ nullable: true })
    .isString()
    .withMessage('Answer must be a string')
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Answer must be at most 1000 characters long'),
  body('displayOrder')
    .optional({ nullable: true })
    .customSanitizer((value) => {
      const numberValue = Number(value);
      return Number.isNaN(numberValue) ? value : numberValue;
    })
    .isInt({ min: 0 })
    .withMessage('Display order must be a non-negative integer'),
  body('isActive')
    .optional({ nullable: true })
    .customSanitizer((value) => parseBooleanLike(value))
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  handleValidation,
];

module.exports = {
  validateFaq,
  validateUpdateFaq,
  handleValidation,
};