const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server'); // Adjust path if needed
const expect = chai.expect;

chai.use(chaiHttp);

describe('Books API', () => {
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
        expect(res).to.have.status(500);
        done();
      });
  });

  it('PUT /books/:id with invalid id should return error', (done) => {
    chai.request(server)
      .put('/books/invalidid')
      .send({ title: "Updated Book" })
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
});
