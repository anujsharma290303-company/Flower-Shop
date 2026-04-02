const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: 'Authentication is not configured' });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Access token is missing' });
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Authorization header must be Bearer token' });
  }


  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;