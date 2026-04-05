const jwt = require('jsonwebtoken');

// FIX #6 — Original code called next() then fell through to the `if (!token)` check,
// causing "Cannot set headers after they are sent" double-response on valid requests.
// Fixed with explicit return statements.
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    return next();
  } catch (error) {
    console.error('JWT verify error:', error.message);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    // Ignore error for optional auth
  }
  return next();
};

module.exports = { protect, optionalAuth };
