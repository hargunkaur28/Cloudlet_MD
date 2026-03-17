const jwt = require('jsonwebtoken');

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: false, // Changed for local debugging reliability
    sameSite: 'lax', // Changed for local debugging reliability
    maxAge: 30 * 24 * 60 * 60 * 1000, 
  });
};

module.exports = generateToken;
