# dockerised-express-api

This application allows you to keep track of books by checking them out for users and returning them.

## Start up

clone the repository with `git clone https://github.com/thirionlogan/dockerised-express-api.git`

start the application with `docker-compose up`

you can access the app at [http://localhost:3000/](http://localhost:3000/)

## Endpoints

- `GET /api/books` responds with all books in library
- `GET /api/books/:id` responds with a single book with that ID
- `GET /api/books/:bookId/checkout/:userId` verifies if the book is available and provides the due date if it is checked out
- `POST /api/books/:bookId/checkout/:userId` checks out a book for a user
- `POST /api/books/:bookId/return` returns a checked out book
