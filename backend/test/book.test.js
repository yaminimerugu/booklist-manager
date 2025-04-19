const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server'); // Adjust path if needed
const expect = chai.expect;
const Book = require('../models/Book'); // Assuming Book model exists

chai.use(chaiHttp);

describe('Books API', () => {
  // Cleanup before and after tests
  beforeEach(async () => {
    // Clear the books collection before each test
    await Book.deleteMany({});
  });

  afterEach(async () => {
    // Optional: Clean up after tests
    await Book.deleteMany({});
  });

  it('GET /books should return array', (done) => {
    chai.request(server)
      .get('/books')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('POST /books should create book', (done) => {
    chai.request(server)
      .post('/books')
      .send({ title: "Test Book", author: "Tester", year: 2024 })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('title', 'Test Book');
        done();
      });
  });

  it('DELETE /books/:id with invalid id should fail', (done) => {
    chai.request(server)
      .delete('/books/invalidid')
      .end((err, res) => {
        expect(res).to.have.status(400); // You can change 500 to 400 or any appropriate status
        done();
      });
  });

  it('PUT /books/:id with invalid id should return error', (done) => {
    chai.request(server)
      .put('/books/invalidid')
      .send({ title: "Updated Book" })
      .end((err, res) => {
        expect(res).to.have.status(400); // Adjust status code as needed
        done();
      });
  });
});
