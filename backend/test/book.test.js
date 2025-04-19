const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const { app, startServer } = require('../server'); // ✅ Correct path
const Book = require('../models/book');

chai.use(chaiHttp);
const expect = chai.expect;

beforeAll(async () => {
  await startServer(); // ✅ Starts MongoDB + Express server
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Books API', () => {
  beforeEach(async () => {
    await Book.deleteMany({});
  });

  afterEach(async () => {
    await Book.deleteMany({});
  });

  test('GET /books should return array', async () => {
    const res = await chai.request(app).get('/books');
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
  });

  test('POST /books should create book', async () => {
    const book = {
      title: 'Test Book',
      author: 'Author A',
      year: 2024,
    };
    const res = await chai.request(app).post('/books').send(book);
    expect(res).to.have.status(201);
    expect(res.body).to.include(book);
  });

  test('DELETE /books/:id with invalid id should fail', async () => {
    const res = await chai.request(app).delete('/books/invalid-id');
    expect(res).to.have.status(400);
  });

  test('PUT /books/:id with invalid id should return error', async () => {
    const res = await chai.request(app).put('/books/invalid-id').send({ title: 'New Title' });
    expect(res).to.have.status(400);
  });
});
