const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');
// const UnathorizedError = require('../errors/unathorizedError');
const AlreadyExistError = require('../errors/alreadyExistError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      next(err);
    });
};

module.exports.getUser = (req, res, next) => {
  User.find({ _id: req.params.id })
    .then((user) => {
      if (!user || !user.length) {
        throw new NotFoundError('Нет пользователя с таким id');
        // res.status(404).send({ message: 'Нет пользователя с таким id' });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send(
      {
        data: {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        },
      },
    ))
    .catch((err) => {
      if (err.code === 11000) {
        next(new AlreadyExistError(err.errmsg));
        // res.status(409).send({ message: err.errmsg });
      } else {
        next(err);
      }
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  const update = { name, about };
  const opts = {
    new: true,
    runValidators: true,
  };

  User.findByIdAndUpdate(req.user._id, update, opts)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const update = { avatar };
  const opts = {
    new: true,
    runValidators: true,
  };

  User.findByIdAndUpdate(req.user._id, update, opts)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // Аутентификация успешна
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      })
        .end();
      // res.send({ token });
    })
    .catch(next);
  // .catch((err) => {
  //   next(new UnathorizedError(err.message));
  //   // res.status(401).send({ message: err.message });
  // });
};
