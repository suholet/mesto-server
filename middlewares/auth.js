const jwt = require('jsonwebtoken');
const UnathorizedError = require('../errors/unathorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new UnathorizedError('Необходима авторизация');
  }

  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new UnathorizedError('Необходима авторизация'));
  }
  req.user = payload;
  next();
};
