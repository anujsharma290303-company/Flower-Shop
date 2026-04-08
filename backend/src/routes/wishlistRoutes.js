const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
	return res.json({
		success: true,
		data: {
			enabled: false,
			informationalOnly: true,
			message: 'Wishlist is informational-only in this backend. No native wishlist persistence or token lookup is provided.',
		},
	});
});

module.exports = router;
