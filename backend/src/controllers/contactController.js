const nodemailer = require('nodemailer');
const { SiteConfig } = require('../models');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const handleError = (res, error, context) => {
	console.error(`[ContactController] ${context}:`, error);
	const status = error.statusCode || 500;
	return res.status(status).json({ success: false, message: error.message || 'Internal server error' });
};

const escapeHtml = (value = '') => value
	.replace(/&/g, '&amp;')
	.replace(/</g, '&lt;')
	.replace(/>/g, '&gt;')
	.replace(/"/g, '&quot;')
	.replace(/'/g, '&#39;');

const hasEmailConfig = () => {
	const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
	const user = process.env.SMTP_USER || process.env.EMAIL_USER;
	const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
	return Boolean(host && user && pass);
};

const parseEmailTransport = () => {
	const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
	const port = Number(process.env.SMTP_PORT || process.env.EMAIL_PORT || 587);
	const secure = String(process.env.SMTP_SECURE || process.env.EMAIL_SECURE || '').toLowerCase() === 'true' || port === 465;
	const user = process.env.SMTP_USER || process.env.EMAIL_USER;
	const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

	if (!host || !user || !pass) {
		throw new Error('Email service is not configured. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS.');
	}

	return nodemailer.createTransport({
		host,
		port,
		secure,
		auth: { user, pass },
	});
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

		if (!hasEmailConfig()) {
			console.warn('[ContactController] SMTP not configured. Logging contact submission.');
			console.log({
				name: cleanName,
				email: cleanEmail,
				phone: cleanPhone || null,
				subject: subject || null,
				message: cleanMessage,
				recipientEmail,
			});

			return res.status(200).json({
				success: true,
				message: 'Message received. We will be in touch soon.',
				data: { delivered: false },
			});
		}

		const transporter = parseEmailTransport();
		const fromAddress = process.env.EMAIL_FROM || process.env.SMTP_USER || process.env.EMAIL_USER;
		const mailSubject = subject && subject.trim() ? subject.trim() : `New contact message from ${cleanName}`;
		const safeName = escapeHtml(cleanName);
		const safeEmail = escapeHtml(cleanEmail);
		const safePhone = escapeHtml(cleanPhone || 'Not provided');
		const safeSubject = escapeHtml(mailSubject);
		const safeMessage = escapeHtml(cleanMessage).replace(/\n/g, '<br />');

		const info = await transporter.sendMail({
			from: fromAddress,
			to: recipientEmail,
			replyTo: cleanEmail,
			subject: mailSubject,
			text: `Name: ${cleanName}\nEmail: ${cleanEmail}\nPhone: ${cleanPhone || 'Not provided'}\n\nMessage:\n${cleanMessage}`,
			html: `
				<h2>New Contact Message</h2>
				<p><strong>Name:</strong> ${safeName}</p>
				<p><strong>Email:</strong> ${safeEmail}</p>
				<p><strong>Phone:</strong> ${safePhone}</p>
				<p><strong>Subject:</strong> ${safeSubject}</p>
				<p><strong>Message:</strong></p>
				<p>${safeMessage}</p>
			`,
		});

		return res.status(200).json({
			success: true,
			message: 'Contact message sent successfully',
			data: {
				messageId: info.messageId,
			},
		});
	} catch (error) {
		return handleError(res, error, 'Send contact error');
	}
};

module.exports = { send };


