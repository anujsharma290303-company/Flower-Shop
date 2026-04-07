const { SiteConfig, NotificationLog } = require('../models');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const handleError = (res, error, context) => {
	console.error(`[ContactController] ${context}:`, error);
	const status = error.statusCode || 500;
	return res.status(status).json({ success: false, message: error.message || 'Internal server error' });
};

const logNotification = async (type, source, recipient, subject, message, metadata = {}) => {
	try {
		await NotificationLog.create({
			type,
			source,
			recipient,
			subject,
			message,
			metadata,
			status: 'logged',
		});
	} catch (error) {
		console.error('[LogNotification] Failed to save notification log:', error.message);
	}
};

const send = async (req, res) => {
	try {
		const { name, email, phone, subject, message } = req.body || {};

		if (!name || !email || !message) {
			return res.status(400).json({
				success: false,
				message: 'Name, email, and message are required',
			});
		}

		if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
			return res.status(400).json({
				success: false,
				message: 'Name, email, and message must be valid strings',
			});
		}

		if (phone !== undefined && typeof phone !== 'string') {
			return res.status(400).json({
				success: false,
				message: 'Phone must be a valid string',
			});
		}

		if (subject !== undefined && typeof subject !== 'string') {
			return res.status(400).json({
				success: false,
				message: 'Subject must be a valid string',
			});
		}

		const cleanName = name.trim();
		const cleanEmail = email.trim().toLowerCase();
		const cleanMessage = message.trim();
		const cleanPhone = phone ? phone.trim() : '';

		if (!cleanName || !cleanEmail || !cleanMessage) {
			return res.status(400).json({
				success: false,
				message: 'Name, email, and message cannot be empty',
			});
		}

		if (!EMAIL_REGEX.test(cleanEmail)) {
			return res.status(400).json({
				success: false,
				message: 'Please provide a valid email address',
			});
		}

		const config = await SiteConfig.findOne();
		const recipientEmail = config?.contactEmail || process.env.EMAIL_TO || process.env.CONTACT_RECEIVER_EMAIL;

		if (!recipientEmail) {
			return res.status(500).json({
				success: false,
				message: 'No contact email is configured for this site',
			});
		}

		const mailSubject = subject && subject.trim() ? subject.trim() : `New contact message from ${cleanName}`;
		const notificationMessage = `Name: ${cleanName}\nEmail: ${cleanEmail}\nPhone: ${cleanPhone || 'Not provided'}\n\nMessage:\n${cleanMessage}`;

		// Log to console
		console.log('\n═══════════════════════════════════════════════════');
		console.log('📧 NEW CONTACT SUBMISSION');
		console.log('═══════════════════════════════════════════════════');
		console.log(`Name: ${cleanName}`);
		console.log(`Email: ${cleanEmail}`);
		console.log(`Phone: ${cleanPhone || 'Not provided'}`);
		console.log(`Subject: ${mailSubject}`);
		console.log(`Recipient Email: ${recipientEmail}`);
		console.log('Message:');
		console.log(cleanMessage);
		console.log('═══════════════════════════════════════════════════\n');

		// Log to database
		await logNotification(
			'contact',
			'contact-form',
			recipientEmail,
			mailSubject,
			notificationMessage,
			{
				contactName: cleanName,
				contactEmail: cleanEmail,
				contactPhone: cleanPhone,
				timestamp: new Date().toISOString(),
			}
		);

		return res.status(200).json({
			success: true,
			message: 'Contact message received and logged successfully',
			data: {
				received: true,
				logged: true,
			},
		});
	} catch (error) {
		return handleError(res, error, 'Send contact error');
	}
};

module.exports = { send };


