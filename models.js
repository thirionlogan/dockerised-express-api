const db = require('./data/db');
const bookshelf = require('bookshelf')(db);

const Book = bookshelf.model('Book', {
  tableName: 'book',
});

exports.Book = Book;
