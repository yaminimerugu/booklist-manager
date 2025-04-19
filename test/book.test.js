const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const { app, server } = require('../backend/server');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Books API', () => {
  it('GET /books should return array', async () => {
    const res = await chai.request(app).get('/books');
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
  });

  it('POST /books should create book', async () => {
    const res = await chai.request(app)
      .post('/books')
      .send({ title: 'Test Book', author: 'Tester', year: 2024 });

    expect(res).to.have.status(201);
    expect(res.body).to.include.keys('_id', 'title', 'author', 'year');
  });

  it('DELETE /books/:id with invalid id should fail', async () => {
    const res = await chai.request(app).delete('/books/invalid-id');
    expect(res).to.have.status(500);
  });

  it('PUT /books/:id with invalid id should return error', async () => {
    const res = await chai.request(app)
      .put('/books/invalid-id')
      .send({ title: 'Updated' });

    expect(res).to.have.status(500);
  });

  // ✅ Proper cleanup
  afterAll(async () => {
    await mongoose.disconnect();
    if (server && server.close) server.close();
  });
});
