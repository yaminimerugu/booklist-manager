const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Import the app, not run it directly
const Book = require('../models/Book');

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/booklist_test');
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Book.deleteMany({});
});

describe('Books API', () => {
  test('GET /books should return array', async () => {
    const response = await request(app).get('/api/books');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /books should create book', async () => {
    const newBook = { title: 'Test Book', author: 'Author', publishYear: 2024 };
    const response = await request(app).post('/api/books').send(newBook);
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(newBook.title);
  });

  test('DELETE /books/:id with invalid id should fail', async () => {
    const response = await request(app).delete('/api/books/invalidid');
    expect(response.statusCode).toBe(400);
  });

  test('PUT /books/:id with invalid id should return error', async () => {
    const updatedBook = { title: 'Updated Title', author: 'Updated Author', publishYear: 2025 };
    const response = await request(app).put('/api/books/invalidid').send(updatedBook);
    expect(response.statusCode).toBe(400);
  });
});
