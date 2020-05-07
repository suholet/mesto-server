const cardsRouter = require('express').Router();
const path = require('path');
const fs = require('fs');

const fsPromises = fs.promises;

async function getCards() {
  const filePath = path.join(__dirname, '../data/cards.json');
  const cards = await fsPromises.readFile(filePath, 'utf8').catch((err) => {
    throw err;
  });
  return cards;
}

cardsRouter.get('/', (req, res) => {
  getCards()
    .then((cards) => {
      res.send(JSON.parse(cards));
    })
    .catch((err) => {
      console.log('Что-то пошло не так при загрузке карточек. ', err);
    });
});

module.exports = cardsRouter;
