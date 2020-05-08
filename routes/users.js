const usersRouter = require('express').Router();
const path = require('path');
const fs = require('fs');

const fsPromises = fs.promises;

async function getUsers() {
  const filePath = path.join(__dirname, '../data/users.json');
  const users = await fsPromises.readFile(filePath, 'utf8').catch((err) => {
    throw err;
  });
  return users;
}

usersRouter.get('/', (req, res) => {
  getUsers()
    .then((users) => {
      res.send(JSON.parse(users));
    })
    .catch((err) => {
      console.log('Что-то пошло не так при загрузке пользователей. ', err);
      next(err);
    });
});

usersRouter.get('/:id', (req, res) => {
  getUsers()
    .then((users) => {
      const user = JSON.parse(users).filter((item) => item._id === req.params.id);

      if (!user || !user.length) {
        res.status(404).send({ message: 'Нет пользователя с таким id' });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      console.log('Что-то пошло не так при загрузке пользователей. ', err);
      next(err);
    });
});

module.exports = usersRouter;
