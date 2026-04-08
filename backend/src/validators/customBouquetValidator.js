const { body, validationResult } = require('express-validator');

const BOUQUET_TYPES = ['sender', 'recipient'];

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

const validateCustomBouquet = [
  body('type')
    .notEmpty()
    .withMessage('type is required')
    .isIn(BOUQUET_TYPES)
    .withMessage('type must be sender or recipient'),
  body('pricePoint')
    .notEmpty()
    .withMessage('pricePoint is required')
    .customSanitizer((value) => {
      const numberValue = Number(value);
      return Number.isNaN(numberValue) ? value : numberValue;
    })
    .isFloat({ min: 25 })
    .withMessage('pricePoint must be at least 25'),
  body('colors')
    .optional({ nullable: true })
    .isArray()
    .withMessage('colors must be an array'),
  body('colors.*')
    .optional({ nullable: true })
    .isString()
    .withMessage('Each color must be a string')
    .trim(),
  body('flowerTypes')
    .optional({ nullable: true })
    .isArray()
    .withMessage('flowerTypes must be an array'),
  body('flowerTypes.*')
    .optional({ nullable: true })
    .isString()
    .withMessage('Each flower type must be a string')
    .trim(),
  body('containerStyle')
    .optional({ nullable: true })
    .isString()
    .withMessage('containerStyle must be a string')
    .trim()
    .isLength({ max: 120 })
    .withMessage('containerStyle must be at most 120 characters long'),
  body('occasion')
    .optional({ nullable: true })
    .isString()
    .withMessage('occasion must be a string')
    .trim()
    .isLength({ max: 120 })
    .withMessage('occasion must be at most 120 characters long'),
  body('extras')
    .optional({ nullable: true })
    .isArray()
    .withMessage('extras must be an array'),
  body('extras.*')
    .optional({ nullable: true })
    .isString()
    .withMessage('Each extra must be a string')
    .trim(),
  body('note')
    .optional({ nullable: true })
    .isString()
    .withMessage('note must be a string')
    .trim()
    .isLength({ max: 2000 })
    .withMessage('note must be at most 2000 characters long'),
  body('orderId')
    .optional({ nullable: true })
    .customSanitizer((value) => {
      if (value === '') return null;
      const numberValue = Number(value);
      return Number.isNaN(numberValue) ? value : numberValue;
    })
    .isInt({ min: 1 })
    .withMessage('orderId must be a positive integer'),
  handleValidation,
];

module.exports = {
  validateCustomBouquet,
  handleValidation,
};
