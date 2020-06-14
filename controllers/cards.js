const Card = require('../models/card');
const NotFoundError = require('../errors/notFoundError');
const AccessDeniedError = require('../errors/accessDeniedError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch(next);
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
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError(`Карточки с id:${req.params.cardId} не существует!`);
    })
    .then((card) => {
      if (card.owner.equals(req.user._id)) {
        card.remove();
        res.send({ data: card });
      } else {
        throw new AccessDeniedError(`У вас нет прав на удаление карточки с id:${req.params.cardId}!`);
      }
    })
    .catch(next);
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
        throw new NotFoundError(`Карточки с id:${req.params.cardId} не существует!`);
      }
    })
    .catch(next);
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
        throw new NotFoundError(`Карточки с id:${req.params.cardId} не существует!`);
      }
    })
    .catch(next);
};
