const express = require('express');
const verifyToken = require('../middleware/auth');
const { get, update } = require('../controllers/siteConfigController');
const { validateUpdateSiteConfig } = require('../validators/siteConfigValidator');
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', get);

// Admin protected routes
router.put('/admin', verifyToken, upload.single('heroImage'), validateUpdateSiteConfig, update);

module.exports = router;
