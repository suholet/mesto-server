const path = require('path');
const express = require('express');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const router = require('./routes/router');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('*', router);

app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`));
