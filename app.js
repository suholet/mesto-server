const path = require('path');
const express = require('express');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const router = require('./routes/router');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('*', router);

// 500 error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ err: 'Что-то пошло не так!' });
});

app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`));
