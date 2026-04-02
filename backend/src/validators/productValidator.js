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

const isValidPrice = (value) => {
  const str = String(value).trim();
  return /^\d+(\.\d{1,2})?$/.test(str) && Number(str) > 0;
};

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

// Validation rules based on Product model required/optional fields.
const validateProduct = [
    body('name')
      .notEmpty()
      .withMessage('Name is required')
      .isString()
      .withMessage('Name must be a string')
      .trim(),
    body('itemCode')
      .notEmpty()
      .withMessage('Item code is required')
      .isString()
      .withMessage('Item code must be a string')
      .trim(),
    body('price')
      .notEmpty()
      .withMessage('Price is required')
      .customSanitizer((value) => (typeof value === 'string' ? value.trim() : value))
      .custom((value) => isValidPrice(value))
      .withMessage('Price must be a valid decimal with up to 2 places')
      .toFloat(),
    body('description')
      .optional({ nullable: true })
      .isString()
      .withMessage('Description must be a string')
      .trim(),
    body('image')
      .optional({ nullable: true })
      .isArray()
      .withMessage('Image must be an array of URLs'),
    body('image.*')
      .optional({ nullable: true })
      .isString()
      .withMessage('Each image value must be a string')
      .trim(),
    body('size')
      .optional({ nullable: true })
      .isString()
      .withMessage('Size must be a string')
      .trim(),
    body('categoryId')
      .notEmpty()
      .withMessage('Category ID is required')
      .isInt({ gt: 0 })
      .withMessage('Category ID must be a positive integer'),
    body('isBestSeller')
      .optional({ nullable: true })
      .custom((value) => parseBooleanLike(value) !== undefined)
      .withMessage('isBestSeller must be a boolean')
      .customSanitizer((value) => parseBooleanLike(value)),
    body('inStock')
      .optional({ nullable: true })
      .custom((value) => parseBooleanLike(value) !== undefined)
      .withMessage('inStock must be a boolean')
      .customSanitizer((value) => parseBooleanLike(value)),
    body('subscriptionAvailable')
      .optional({ nullable: true })
      .custom((value) => parseBooleanLike(value) !== undefined)
      .withMessage('subscriptionAvailable must be a boolean')
      .customSanitizer((value) => parseBooleanLike(value)),
    handleValidation,
];

const validateUpdateProduct = [
    body().custom((_, { req }) => {
      if (!req.body || Object.keys(req.body).length === 0) {
        throw new Error('At least one field is required to update product');
      }

      return true;
    }),
    body('name')
      .optional({ nullable: true })
      .notEmpty()
      .withMessage('Name cannot be empty')
      .isString()
      .withMessage('Name must be a string')
      .trim(),
    body('itemCode')
      .optional({ nullable: true })
      .notEmpty()
      .withMessage('Item code cannot be empty')
      .isString()
      .withMessage('Item code must be a string')
      .trim(),
    body('price')
      .optional({ nullable: true })
      .customSanitizer((value) => (typeof value === 'string' ? value.trim() : value))
      .custom((value) => isValidPrice(value))
      .withMessage('Price must be a valid decimal with up to 2 places')
      .toFloat(),
    body('description')
      .optional({ nullable: true })
      .isString()
      .withMessage('Description must be a string')
      .trim(),
    body('image')
      .optional({ nullable: true })
      .isArray()
      .withMessage('Image must be an array of URLs'),
    body('image.*')
      .optional({ nullable: true })
      .isString()
      .withMessage('Each image value must be a string')
      .trim(),
    body('size')
      .optional({ nullable: true })
      .isString()
      .withMessage('Size must be a string')
      .trim(),
    body('categoryId')
      .optional({ nullable: true })
      .isInt({ gt: 0 })
      .withMessage('Category ID must be a positive integer'),
    body('isBestSeller')
      .optional({ nullable: true })
      .custom((value) => parseBooleanLike(value) !== undefined)
      .withMessage('isBestSeller must be a boolean')
      .customSanitizer((value) => parseBooleanLike(value)),
    body('inStock')
      .optional({ nullable: true })
      .custom((value) => parseBooleanLike(value) !== undefined)
      .withMessage('inStock must be a boolean')
      .customSanitizer((value) => parseBooleanLike(value)),
    body('subscriptionAvailable')
      .optional({ nullable: true })
      .custom((value) => parseBooleanLike(value) !== undefined)
      .withMessage('subscriptionAvailable must be a boolean')
      .customSanitizer((value) => parseBooleanLike(value)),
    handleValidation,
];

module.exports = {
  validateProduct,
  validateUpdateProduct,
  handleValidation,
};


