const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

const verifyToken = (req, res, next) => {
  // Try to get token from cookie first
  let token = req.cookies && req.cookies.token;
  // Fallback to Authorization header for legacy support
  if (!token) {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId; // attach userId to request
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;
