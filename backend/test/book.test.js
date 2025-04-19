const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const { app, startServer } = require('../server'); // ✅ Correct path
const Book = require('../models/Book');

chai.use(chaiHttp);
const expect = chai.expect;

let server; // Variable to hold the server instance

// Connect to the MongoDB before tests
beforeAll(async () => {
  await startServer(); // Starts the Express server
  server = app.listen(5000); // Ensure server is running
});

// Disconnect from MongoDB and close server after all tests
afterAll(async () => {
  await mongoose.connection.close(); // Disconnect MongoDB
  await server.close();              // Close server connection
});

// Ensure the database is clean before each test
beforeEach(async () => {
  await Book.deleteMany({}); // Clear the collection before each test
});

// Clean the database after each test
afterEach(async () => {
  await Book.deleteMany({}); // Clear the collection after each test
});

describe('Books API', () => {
  test('GET /books should return an array', async () => {
    const res = await chai.request(server).get('/books');
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
  });

  test('POST /books should create a book', async () => {
    const book = {
      title: 'Test Book',
      author: 'Author A',
      year: 2024,
    };
    const res = await chai.request(server).post('/books').send(book);
    expect(res).to.have.status(201);
    expect(res.body).to.include(book);
  });

  test('DELETE /books/:id with an invalid id should fail', async () => {
    const res = await chai.request(server).delete('/books/invalid-id');
    expect(res).to.have.status(400);
  });

  test('PUT /books/:id with an invalid id should return an error', async () => {
    const res = await chai.request(server).put('/books/invalid-id').send({ title: 'New Title' });
    expect(res).to.have.status(400);
  });
});
