const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { message: 'Too many requests, please try again later.' },
  statusCode: 429, // 429 Too Many Requests
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = limiter;