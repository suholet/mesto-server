const usersRouter = require('express').Router();
const users = require('../data/users.json');

function findUser(id) {
  return users.filter((user) => user._id === id);
}

usersRouter.get('/', (req, res) => {
  res.send(users);
});

usersRouter.get('/:id', (req, res) => {
  const user = findUser(req.params.id);
  if (!user || !user.length) {
    res.status(404).send({ message: 'Нет пользователя с таким id' });
    return;
  }
  res.send(user);
});

module.exports = usersRouter;
