const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch((err) => {
      console.log('Что-то пошло не так при загрузке карточек. ', err);
      next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  const {
    name,
    link,
    likes,
    owner = req.user._id,
  } = req.body;

  Card.create({
    name,
    link,
    likes,
    owner,
  })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      console.log('Что-то пошло не так при создании карточки. ', err);
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { _id } = req.body;
  Card.findByIdAndRemove({ _id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      console.log('Что-то пошло не так при удалении карточки. ', err);
      next(err);
    });
};
