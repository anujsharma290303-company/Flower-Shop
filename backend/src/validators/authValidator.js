const { body } = require('express-validator');

// Validation rules for login
const loginValidationRules = () => {
  return [
    body('email')
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Email must be a valid email address')
      .trim()
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ];
};

// Validation rules for customer registration
const registerValidationRules = () => {
  return [
    body('firstName')
      .notEmpty()
      .withMessage('First name is required')
      .isString()
      .withMessage('First name must be a string')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('First name must be between 2 and 100 characters long'),
    body('lastName')
      .notEmpty()
      .withMessage('Last name is required')
      .isString()
      .withMessage('Last name must be a string')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Last name must be between 2 and 100 characters long'),
    body('email')
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Email must be a valid email address')
      .trim()
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ];
};

// Validation rules for customer profile update
const updateProfileValidationRules = () => {
  return [
    body('firstName')
      .optional()
      .isString()
      .withMessage('First name must be a string')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('First name must be between 2 and 100 characters long'),
    body('lastName')
      .optional()
      .isString()
      .withMessage('Last name must be a string')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Last name must be between 2 and 100 characters long'),
    body().custom((value) => {
      const hasFirstName = value && Object.prototype.hasOwnProperty.call(value, 'firstName');
      const hasLastName = value && Object.prototype.hasOwnProperty.call(value, 'lastName');
      if (!hasFirstName && !hasLastName) {
        throw new Error('At least one field is required: firstName or lastName');
      }
      return true;
    }),
  ];
};

// Validation rules for customer password change
const changePasswordValidationRules = () => {
  return [
    body('oldPassword')
      .notEmpty()
      .withMessage('Old password is required')
      .isLength({ min: 6 })
      .withMessage('Old password must be at least 6 characters long'),
    body('newPassword')
      .notEmpty()
      .withMessage('New password is required')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters long')
      .custom((newPassword, { req }) => {
        if (newPassword === req.body.oldPassword) {
          throw new Error('New password must be different from old password');
        }
        return true;
      }),
  ];
};

module.exports = {
  registerValidationRules,
  loginValidationRules,
  updateProfileValidationRules,
  changePasswordValidationRules,
};
