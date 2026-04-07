const jwt = require('jsonwebtoken');

const optionalCustomerAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next();
  }

  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ success: false, message: 'Authorization header must be Bearer token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.tokenType !== 'customer') {
      return res.status(403).json({ success: false, message: 'Invalid token for customer context' });
    }
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
};

module.exports = optionalCustomerAuth;
