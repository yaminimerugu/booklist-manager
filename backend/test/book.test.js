const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const { app, startServer } = require('../server'); // ✅ Correct path
const Book = require('../models/Book');

chai.use(chaiHttp);
const expect = chai.expect;

let server;  // Declare server to access it in afterAll
const port = 0; // Use 0 to let the OS assign a free port

beforeAll(async () => {
  await startServer(); // Starts the Express server
  server = app.listen(port, () => {
    console.log(`Test server running on ${server.address().port}`);
  }); // Ensure server is running on an available port
});

afterAll(async () => {
  await mongoose.connection.close(); // Disconnect from MongoDB
  await new Promise(resolve => {
    server.close(resolve); // Ensure server is closed properly
  });
});

describe('Books API', () => {
  beforeEach(async () => {
    await Book.deleteMany({}); // Clean up before each test
  });

  afterEach(async () => {
    await Book.deleteMany({}); // Clean up after each test
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
