const jwt = require('jsonwebtoken');
const { User } = require('../models/associations.js');

exports.authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token missing' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(payload.id);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};