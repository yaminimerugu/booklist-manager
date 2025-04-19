const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const { app } = require('../server'); // only import app
const Book = require('../models/Book');

chai.use(chaiHttp);
const expect = chai.expect;

// Connect to a test database before running any tests
beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/booklist_test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Disconnect and clean up after all tests
afterAll(async () => {
  await mongoose.connection.dropDatabase(); // optional: clear test DB
  await mongoose.disconnect();
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
