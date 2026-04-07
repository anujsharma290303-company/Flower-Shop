const express = require('express');
const { login, me } = require('../controllers/authControllers');
const verifyToken = require('../middleware/auth');
const { loginValidationRules } = require('../validators/authValidator');
const validate = require('../middleware/validateRequest');

const router = express.Router();

router.post('/login', loginValidationRules(), validate, login);
router.get('/me', verifyToken, me);

module.exports = router;
