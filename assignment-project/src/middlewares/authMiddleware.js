const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify JWT with secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach decoded user to req.user
    req.user = decoded;
    next();
  } catch (err) {
    // Return 401 if invalid or missing token
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};