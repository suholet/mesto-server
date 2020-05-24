const User = require('../models/user');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.log('Что-то пошло не так при загрузке пользователей. ', err);
      next(err);
    });
};

module.exports.getUser = (req, res, next) => {
  User.find({ _id: req.params.id })
    .then((user) => {
      if (!user || !user.length) {
        res.status(404).send({ message: 'Нет пользователя с таким id' });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      console.log('Что-то пошло не так при загрузке пользователя. ', err);
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      console.log('Что-то пошло не так при создании пользователя. ', err);
      next(err);
    });
};
