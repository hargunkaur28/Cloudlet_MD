const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Read the JWT from the cookie
  token = req.cookies.jwt;

  // Fallback to Bearer token just in case
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');
      next();
    } catch (error) {
      console.error('JWT Verification Failed:', error.message);
      res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  } else {
    console.error('No JWT Token found in cookies or headers');
    console.log('Cookies received:', JSON.stringify(req.cookies));
    res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

module.exports = protect;
