const request = require('supertest');
const app = require('./app');
const db = require('./data/db');

describe('Endpoints', () => {
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
  });
});
