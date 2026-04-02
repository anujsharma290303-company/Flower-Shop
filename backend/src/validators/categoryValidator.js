const { body, validationResult } = require('express-validator');

const parseBooleanLike = (value) => {
  if (typeof value === 'boolean') return value;
  if (value === 'true' || value === '1') return true;
  if (value === 'false' || value === '0') return false;
  return value;
};

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

const validateCategory = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isString()
    .withMessage('Name must be a string')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  body('description')
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Description must be a string')
    .trim(),

  body('icon')
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Icon must be a string')
    .trim(),

  body('displayOrder')
    .optional({ checkFalsy: true })
    .customSanitizer((value) => {
      const num = Number(value);
      return isNaN(num) ? value : num;
    })
    .isInt({ min: 0 })
    .withMessage('Display order must be a non-negative integer'),

  body('isActive')
    .optional({ checkFalsy: true })
    .customSanitizer((value) => parseBooleanLike(value))
    .isBoolean()
    .withMessage('isActive must be a boolean'),

  body('parentId')
    .optional({ checkFalsy: true })
    .customSanitizer((value) => {
      const num = Number(value);
      return isNaN(num) ? value : num;
    })
    .isInt({ min: 1 })
    .withMessage('Parent ID must be a positive integer'),

  handleValidation,
];

const validateUpdateCategory = [
  (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one field is required to update',
      });
    }
    next();
  },

  body('name')
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Name must be a string')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  body('description')
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Description must be a string')
    .trim(),

  body('icon')
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Icon must be a string')
    .trim(),

  body('displayOrder')
    .optional({ checkFalsy: true })
    .customSanitizer((value) => {
      const num = Number(value);
      return isNaN(num) ? value : num;
    })
    .isInt({ min: 0 })
    .withMessage('Display order must be a non-negative integer'),

  body('isActive')
    .optional({ checkFalsy: true })
    .customSanitizer((value) => parseBooleanLike(value))
    .isBoolean()
    .withMessage('isActive must be a boolean'),

  body('parentId')
    .optional({ checkFalsy: true })
    .customSanitizer((value) => {
      const num = Number(value);
      return isNaN(num) ? value : num;
    })
    .isInt({ min: 1 })
    .withMessage('Parent ID must be a positive integer'),

  handleValidation,
];

module.exports = { validateCategory, validateUpdateCategory };
