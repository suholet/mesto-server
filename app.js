// const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const router = require('./routes/router');
const { createUser, login } = require('./controllers/users');

const auth = require('./middlewares/auth');

require('dotenv').config();

const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/mestodb';
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);
app.use(helmet());
app.use(cookieParser());

mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);
app.use('*', auth, router);

// Обработчик ошибок celebrate
app.use(errors());

// Централизованный обработчик ошибок
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'Произошла ошибка' : err.message,
  });
});

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`));
