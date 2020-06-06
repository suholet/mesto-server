const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch((err) => {
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
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findOneAndRemove({ _id: req.params.cardId, owner: req.user._id })
  // Card.findByIdAndRemove(req.params.cardId, { owner: req.user._id })
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        res.status(404).send({ message: `Что-то пошло не так при удалении карточки с id:${req.params.cardId}!` });
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  const update = {
    $addToSet: {
      likes: req.user._id,
    },
  };
  const opts = {
    new: true,
  };
  Card.findByIdAndUpdate(req.params.cardId, update, opts)
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        res.status(404).send({ message: `Карточки с id:${req.params.cardId} не существует!` });
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const update = {
    $pull: {
      likes: req.user._id,
    },
  };
  const opts = {
    new: true,
  };
  Card.findByIdAndUpdate(req.params.cardId, update, opts)
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        res.status(404).send({ message: `Карточки с id:${req.params.cardId} не существует!` });
      }
    })
    .catch((err) => {
      next(err);
    });
};
