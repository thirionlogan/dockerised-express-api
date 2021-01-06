const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Book } = require('./models');

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.get('/api/books', (req, res) => {
  Book.fetchAll()
    .then((books) => {
      const trasformedBooks = books.models
        .map((bookModel) => bookModel.attributes)
        .map((book) => {
          return {
            ...book,
            checkedOut: book.checkedOut === 1 ? true : false,
          };
        });
      res.status(200).send(trasformedBooks);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send();
    });
});

app.use((req, res) => {
  res.status(404).send('resource not found');
});

module.exports = app;
