const jwt = require('jsonwebtoken');
const UnathorizedError = require('../errors/unathorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

// const handleAuthError = (res) => {
//   res.status(401).send({ message: 'Необходима авторизация' });
// };

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  // const { authHeaders } = req.headers;

  // if (!authHeaders || !authHeaders.startsWith('Bearer')) {
  //   return handleAuthError(res);
  // }

  // const token = authHeaders.replace('Bearer ', '');
  const token = req.cookies.jwt;
  if (!token) {
    throw new UnathorizedError('Необходима авторизация');
    // return handleAuthError(res);
  }

  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new UnathorizedError('Необходима авторизация');
    // return handleAuthError(res);
  }
  req.user = payload;
  next();
};
