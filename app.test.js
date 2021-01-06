const request = require('supertest');
const app = require('./app');
const db = require('./data/db');
const moment = require('moment');

describe('Endpoints', () => {
  const twoWeeksFromNow = moment()
    .add(2, 'weeks')
    .format('YYYY-MM-DD HH:mm:ss');

  describe('404', () => {
    it('should respond with 404', async () => {
      const response = await request(app).get('/doesNotExist');
      expect(response.statusCode).toBe(404);
      expect(response.text).toBe('resource not found');
    });
  });

  describe('Database endpoints', () => {
    beforeAll(async () => {
      await db.migrate.latest().then(() => {
        return db.seed.run();
      });
    });

    afterAll(async () => {
      await db.migrate.rollback();
    });

    describe('GET /api/books', () => {
      it('should respond with a list of books', async () => {
        const expectedResponse = expect.arrayContaining([
          expect.objectContaining({
            title: 'Lord of the Rings',
            author: 'J. R. R. Tolkien',
            ISBN: '0618645616',
            checkedOut: false,
          }),
          expect.objectContaining({
            title: 'The Hobbit',
            author: 'J. R. R. Tolkien',
            ISBN: '9780618968633',
            checkedOut: false,
          }),
          expect.objectContaining({
            title: 'Start With Why',
            author: 'Simon Sinek',
            ISBN: '9781591842804',
            checkedOut: false,
          }),
        ]);

        const response = await request(app).get('/api/books');
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject(expectedResponse);
      });
    });

    describe('POST /api/books/:bookId/checkout/:userId', () => {
      it('should respond with 200', async () => {
        const response = await request(app).post('/api/books/1/checkout/1');
        expect(response.statusCode).toBe(200);
      });

      it('should respond with a 409 when checking out a checked out book', async () => {
        const response = await request(app).post('/api/books/1/checkout/2');
        expect(response.statusCode).toBe(409);
      });

      it('should respond with a 404', async () => {
        const response = await request(app).post('/api/books/100/checkout/1');
        expect(response.statusCode).toBe(404);
      });
    });

    describe('GET /api/books/:bookId/checkout/:userId', () => {
      it('should return message when user has book checked out', async () => {
        const expectedResponse = {
          message: `User has book checked out. Return book before ${twoWeeksFromNow}`,
          checkedOut: true,
          userHasBook: true,
          dueDate: twoWeeksFromNow,
        };

        const response = await request(app).get('/api/books/1/checkout/1');
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject(expectedResponse);
      });
      it('should return message when another user has book checked out', async () => {
        const expectedResponse = {
          message: `Book is checked out. Come back at ${twoWeeksFromNow}`,
          checkedOut: true,
          userHasBook: false,
          dueDate: twoWeeksFromNow,
        };
        const response = await request(app).get('/api/books/1/checkout/2');
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject(expectedResponse);
      });
      it('should return message when book is not checked out', async () => {
        const expectedResponse = {
          message: 'Book is available to be checked out',
          checkedOut: false,
          userHasBook: false,
        };
        const response = await request(app).get('/api/books/2/checkout/1');
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject(expectedResponse);
      });
      it('should respond with a 404', async () => {
        const response = await request(app).post('/api/books/100/checkout/1');
        expect(response.statusCode).toBe(404);
      });
    });

    describe('GET /api/books/:bookId', () => {
      it('should respond with a book that is checked out', async () => {
        const expectedResponse = expect.objectContaining({
          title: 'Lord of the Rings',
          author: 'J. R. R. Tolkien',
          ISBN: '0618645616',
          checkedOut: true,
          dueDate: twoWeeksFromNow,
        });

        const response = await request(app).get('/api/books/1');
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject(expectedResponse);
      });

      it('should respond with a book that is not checked out', async () => {
        const expectedResponse = expect.objectContaining({
          title: 'The Hobbit',
          author: 'J. R. R. Tolkien',
          ISBN: '9780618968633',
          checkedOut: false,
        });

        const response = await request(app).get('/api/books/2');
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject(expectedResponse);
      });

      it('should respond with a 404', async () => {
        const response = await request(app).get('/api/books/100');
        expect(response.statusCode).toBe(404);
      });
    });
  });
});
