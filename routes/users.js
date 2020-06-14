const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

usersRouter.get('/', getUsers);

usersRouter.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}),
getUser);

usersRouter.patch('/me', celebrate({
  headers: Joi.object().keys({
    'content-type': Joi.string().required().regex(/application\/json/),
  }).unknown(true),
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}),
updateProfile);

usersRouter.patch('/me/avatar', celebrate({
  headers: Joi.object().keys({
    'content-type': Joi.string().required().regex(/application\/json/),
  }).unknown(true),
  body: Joi.object().keys({
    avatar: Joi.string().required().uri({
      scheme: ['http', 'https'],
    }),
  }),
}),
updateAvatar);

module.exports = usersRouter;
