const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const moment = require('moment');
const { Book } = require('./models');

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

const parseBookModelToObject = (bookModel) => {
  const { attributes } = bookModel;
  return {
    ...attributes,
    checkedOut: attributes.checkedOut === 1 ? true : false,
  };
};

const getBookById = (id) => {
  return Book.where({ id })
    .fetch({ require: true })
    .then(parseBookModelToObject);
};

app.get('/api/books', (req, res) => {
  Book.fetchAll()
    .then((books) => {
      const trasformedBooks = books.models.map(parseBookModelToObject);
      res.status(200).send(trasformedBooks);
    })
    .catch((err) => {
      res.status(500).send();
    });
});

app.get('/api/books/:id', (req, res) => {
  Book.where({ id: req.params.id })
    .fetch({ require: true })
    .then((bookModel) => {
      res.status(200).send(parseBookModelToObject(bookModel));
    })
    .catch((err) => {
      res.status(404).send();
    });
});

const checkOutBook = ({ bookId, userId }) => {
  return new Book({ id: bookId }).save(
    {
      checkedOut: true,
      dueDate: moment().add(2, 'weeks').format('YYYY-MM-DD HH:mm:ss'),
      user_id: userId,
    },
    { require: true, method: 'update', patch: true }
  );
};

app.post('/api/books/:bookId/checkout/:userId', (req, res) => {
  const { bookId, userId } = req.params;
  getBookById(bookId)
    .then((book) => {
      if (book.checkedOut == true) {
        res.status(409).send();
      } else {
        checkOutBook({ bookId, userId })
          .then(() => {
            res.status(200).send();
          })
          .catch((err) => {
            res.status(404).send();
          });
      }
    })
    .catch((err) => {
      res.status(404).send();
    });
});

app.get('/api/books/:bookId/checkout/:userId', (req, res) => {
  const { bookId, userId } = req.params;
  getBookById(bookId)
    .catch((err) => {
      res.status(404).send();
    })
    .then((book) => {
      let message = 'Book is available to be checked out';
      if (book.checkedOut && userId === `${book.user_id}`) {
        message = `User has book checked out. Return book before ${book.dueDate}`;
      } else if (book.checkedOut) {
        message = `Book is checked out. Come back at ${book.dueDate}`;
      }
      const responseBody = {
        message,
        checkedOut: book.checkedOut,
        dueDate: book.dueDate,
        userHasBook: userId === `${book.user_id}`,
      };
      res.status(200).send(responseBody);
    });
});

app.post('/api/books/:bookId/return', (req, res) => {
  const { bookId } = req.params;
  getBookById(bookId)
    .catch((err) => {
      res.status(404).send();
    })
    .then((book) => {
      if (!book.checkedOut) res.status(409).send();
      new Book({ id: bookId })
        .save(
          {
            checkedOut: false,
            dueDate: null,
            user_id: null,
          },
          { require: true, method: 'update', patch: true }
        )
        .then(res.status(200).send());
    })
    .catch(() => {});
});

app.use((req, res) => {
  res.status(404).send('resource not found');
});

module.exports = app;
