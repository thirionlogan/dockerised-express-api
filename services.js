const { Book } = require('./models');
const moment = require('moment');

const parseBookModelToObject = (bookModel) => {
  const { attributes } = bookModel;
  return {
    ...attributes,
    checkedOut: attributes.checkedOut === 1 ? true : false,
  };
};

module.exports = {
  getAllBooks: () =>
    Book.fetchAll().then((bookModels) =>
      bookModels.models.map(parseBookModelToObject)
    ),
  getBookById: (id) =>
    Book.where({ id }).fetch({ require: true }).then(parseBookModelToObject),
  checkOutBook: (bookId, userId) =>
    new Book({ id: bookId }).save(
      {
        checkedOut: true,
        dueDate: moment().add(2, 'weeks').format('YYYY-MM-DD HH:mm:ss'),
        user_id: userId,
      },
      { require: true, method: 'update', patch: true }
    ),
  returnBook: (id) =>
    new Book({ id }).save(
      {
        checkedOut: false,
        dueDate: null,
        user_id: null,
      },
      { require: true, method: 'update', patch: true }
    ),
  checkBookAvailability: ({ checkedOut, dueDate, user_id }, userId) => {
    let message = 'Book is available to be checked out';
    const userHasBook = userId === `${user_id}`;
    if (checkedOut && userHasBook) {
      message = `User has book checked out. Return book before ${dueDate}`;
    } else if (checkedOut) {
      message = `Book is checked out. Come back at ${dueDate}`;
    }
    return {
      message,
      checkedOut,
      dueDate,
      userHasBook,
    };
  },
};
