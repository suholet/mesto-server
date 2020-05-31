const jwt = require('jsonwebtoken');

const handleAuthError = (res) => {
  res.status(401).send({ message: 'Необходима авторизация' });
};

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authHeaders } = req.headers;

  if (!authHeaders || !authHeaders.startsWith('Bearer')) {
    return handleAuthError(res);
  }

  const token = authHeaders.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'HASH');
  } catch (err) {
    return handleAuthError(res);
  }
  req.user = payload;
  next();
};
