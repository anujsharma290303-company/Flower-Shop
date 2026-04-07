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

const validateCreateBlog = [
  body('title')
    .notEmpty()
    .withMessage('title is required')
    .isString()
    .withMessage('title must be a string')
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('title must be between 3 and 255 characters long'),
  body('slug')
    .optional({ nullable: true })
    .isString()
    .withMessage('slug must be a string')
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('slug must be between 3 and 255 characters long'),
  body('excerpt')
    .notEmpty()
    .withMessage('excerpt is required')
    .isString()
    .withMessage('excerpt must be a string')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('excerpt must be between 10 and 2000 characters long'),
  body('content')
    .notEmpty()
    .withMessage('content is required')
    .isString()
    .withMessage('content must be a string')
    .trim()
    .isLength({ min: 20 })
    .withMessage('content must be at least 20 characters long'),
  body('coverImage')
    .optional({ nullable: true })
    .isString()
    .withMessage('coverImage must be a string')
    .trim(),
  body('author')
    .notEmpty()
    .withMessage('author is required')
    .isString()
    .withMessage('author must be a string')
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage('author must be between 2 and 120 characters long'),
  body('isPublished')
    .optional({ nullable: true })
    .custom((value) => parseBooleanLike(value) !== undefined)
    .withMessage('isPublished must be a boolean')
    .customSanitizer((value) => parseBooleanLike(value)),
  body('publishedAt')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('publishedAt must be a valid ISO date'),
  handleValidation,
];

const validateUpdateBlog = [
  body().custom((_, { req }) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new Error('At least one field is required to update blog');
    }

    return true;
  }),
  body('title')
    .optional({ nullable: true })
    .isString()
    .withMessage('title must be a string')
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('title must be between 3 and 255 characters long'),
  body('slug')
    .optional({ nullable: true })
    .isString()
    .withMessage('slug must be a string')
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('slug must be between 3 and 255 characters long'),
  body('excerpt')
    .optional({ nullable: true })
    .isString()
    .withMessage('excerpt must be a string')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('excerpt must be between 10 and 2000 characters long'),
  body('content')
    .optional({ nullable: true })
    .isString()
    .withMessage('content must be a string')
    .trim()
    .isLength({ min: 20 })
    .withMessage('content must be at least 20 characters long'),
  body('coverImage')
    .optional({ nullable: true })
    .isString()
    .withMessage('coverImage must be a string')
    .trim(),
  body('author')
    .optional({ nullable: true })
    .isString()
    .withMessage('author must be a string')
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage('author must be between 2 and 120 characters long'),
  body('isPublished')
    .optional({ nullable: true })
    .custom((value) => parseBooleanLike(value) !== undefined)
    .withMessage('isPublished must be a boolean')
    .customSanitizer((value) => parseBooleanLike(value)),
  body('publishedAt')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('publishedAt must be a valid ISO date'),
  handleValidation,
];

module.exports = {
  validateCreateBlog,
  validateUpdateBlog,
  handleValidation,
};
