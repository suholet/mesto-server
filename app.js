const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const router = require('./routes/router');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// temporary auth stub
app.use((req, res, next) => {
  req.user = {
    _id: '5ecaa4322383ec8133d124a3',
  };
  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('*', router);

// 500 error handler
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).send({ err });
});

app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`));
