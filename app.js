const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const {
  getAllBooks,
  getBookById,
  checkOutBook,
  returnBook,
  checkBookAvailability,
} = require('./services');

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.get('/api/books', (req, res) => {
  getAllBooks()
    .then((books) => {
      res.status(200).send(books);
    })
    .catch((err) => {
      res.sendStatus(500);
    });
});

app.get('/api/books/:id', (req, res) => {
  getBookById(req.params.id)
    .then((book) => {
      res.status(200).send(book);
    })
    .catch((err) => {
      res.sendStatus(404);
    });
});

app.post('/api/books/:bookId/checkout/:userId', (req, res) => {
  const { bookId, userId } = req.params;
  getBookById(bookId)
    .then((book) => {
      if (book.checkedOut == true) {
        res.sendStatus(409);
      } else {
        checkOutBook(bookId, userId)
          .then(() => {
            res.sendStatus(200);
          })
          .catch((err) => {
            res.sendStatus(404);
          });
      }
    })
    .catch((err) => {
      res.sendStatus(404);
    });
});

app.get('/api/books/:bookId/checkout/:userId', (req, res) => {
  const { bookId, userId } = req.params;
  getBookById(bookId)
    .catch((err) => {
      res.sendStatus(404);
    })
    .then((book) => {
      const responseBody = checkBookAvailability(book, userId);
      res.status(200).send(responseBody);
    });
});

app.post('/api/books/:bookId/return', (req, res) => {
  const { bookId } = req.params;
  getBookById(bookId)
    .catch((err) => {
      res.sendStatus(404);
    })
    .then((book) => {
      if (!book.checkedOut) res.sendStatus(409);
      returnBook(bookId).then(res.sendStatus(200));
    })
    .catch(() => {});
});

app.use((req, res) => {
  res.sendStatus(404);
});

module.exports = app;
