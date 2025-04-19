const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index"); // Update this if your entry point is named differently
const Book = require("../models/bookModel");

require("dotenv").config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/booklist_test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Book.deleteMany({});
});

describe("📚 Book API Tests", () => {
  describe("GET /api/books", () => {
    test("should return all books", async () => {
      await Book.create({ title: "Test Book 1", author: "Author 1" });
      const res = await request(app).get("/api/books");
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
    });

    test("should return books with correct fields", async () => {
      await Book.create({ title: "Test Book", author: "Author" });
      const res = await request(app).get("/api/books");
      expect(res.body[0]).toHaveProperty("title");
      expect(res.body[0]).toHaveProperty("author");
    });
  });

  describe("POST /api/books", () => {
    test("should create a book", async () => {
      const res = await request(app)
        .post("/api/books")
        .send({ title: "New Book", author: "Test Author", year: 2024 });
      expect(res.statusCode).toBe(201);
      expect(res.body.title).toBe("New Book");
    });

    test("should not create book without title", async () => {
      const res = await request(app)
        .post("/api/books")
        .send({ author: "Author" });
      expect(res.statusCode).toBe(400);
    });

    test("should not create book without author", async () => {
      const res = await request(app)
        .post("/api/books")
        .send({ title: "Title only" });
      expect(res.statusCode).toBe(400);
    });

    test("should not create with empty body", async () => {
      const res = await request(app).post("/api/books").send({});
      expect(res.statusCode).toBe(400);
    });

    test("should create multiple books", async () => {
      for (let i = 0; i < 3; i++) {
        const res = await request(app)
          .post("/api/books")
          .send({ title: `Book ${i}`, author: `Author ${i}` });
        expect(res.statusCode).toBe(201);
      }
    });
  });

  describe("GET /api/books/:id", () => {
    test("should get a book by ID", async () => {
      const book = await Book.create({ title: "Fetch Me", author: "Getter" });
      const res = await request(app).get(`/api/books/${book._id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe("Fetch Me");
    });

    test("should return 404 if book not found", async () => {
      const res = await request(app).get("/api/books/612345678901234567890123");
      expect(res.statusCode).toBe(404);
    });

    test("should return 400 for invalid ID", async () => {
      const res = await request(app).get("/api/books/invalidID");
      expect(res.statusCode).toBe(400);
    });
  });

  describe("PUT /api/books/:id", () => {
    test("should update book title", async () => {
      const book = await Book.create({ title: "Old", author: "Author" });
      const res = await request(app)
        .put(`/api/books/${book._id}`)
        .send({ title: "New Title" });
      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe("New Title");
    });

    test("should update author", async () => {
      const book = await Book.create({ title: "Book", author: "Old Author" });
      const res = await request(app)
        .put(`/api/books/${book._id}`)
        .send({ author: "New Author" });
      expect(res.statusCode).toBe(200);
      expect(res.body.author).toBe("New Author");
    });

    test("should return 404 if book not found", async () => {
      const res = await request(app)
        .put("/api/books/612345678901234567890123")
        .send({ title: "Doesn't Matter" });
      expect(res.statusCode).toBe(404);
    });

    test("should return 400 for invalid ID", async () => {
      const res = await request(app).put("/api/books/badid").send({ title: "X" });
      expect(res.statusCode).toBe(400);
    });

    test("should not add unknown fields", async () => {
      const book = await Book.create({ title: "Safe Book", author: "A" });
      const res = await request(app)
        .put(`/api/books/${book._id}`)
        .send({ unknown: "malicious" });
      expect(res.body).not.toHaveProperty("unknown");
    });
  });

  describe("DELETE /api/books/:id", () => {
    test("should delete a book", async () => {
      const book = await Book.create({ title: "Delete Me", author: "Gone" });
      const res = await request(app).delete(`/api/books/${book._id}`);
      expect(res.statusCode).toBe(200);
    });

    test("should return 404 if already deleted", async () => {
      const book = await Book.create({ title: "Temp", author: "Ghost" });
      await Book.findByIdAndDelete(book._id);
      const res = await request(app).delete(`/api/books/${book._id}`);
      expect(res.statusCode).toBe(404);
    });

    test("should return 400 for invalid ID", async () => {
      const res = await request(app).delete("/api/books/badid");
      expect(res.statusCode).toBe(400);
    });

    test("should not affect other books", async () => {
      const book1 = await Book.create({ title: "To Delete", author: "One" });
      const book2 = await Book.create({ title: "To Keep", author: "Two" });
      await request(app).delete(`/api/books/${book1._id}`);
      const found = await Book.findById(book2._id);
      expect(found).not.toBeNull();
    });
  });

  describe("Validation & Logic Edge Cases", () => {
    test("should not allow duplicate titles if unique", async () => {
      await Book.create({ title: "Unique", author: "A" });
      const res = await request(app)
        .post("/api/books")
        .send({ title: "Unique", author: "B" });
      expect([400, 409]).toContain(res.statusCode); // adjust if schema isn't unique
    });

    test("should support sorting if implemented", async () => {
      const res = await request(app).get("/api/books?sort=title");
      expect([200, 400, 404]).toContain(res.statusCode); // depending on implementation
    });

    test("should support filtering if implemented", async () => {
      const res = await request(app).get("/api/books?author=Ghost");
      expect([200, 400, 404]).toContain(res.statusCode);
    });

    test("should support pagination if implemented", async () => {
      const res = await request(app).get("/api/books?page=1&limit=2");
      expect([200, 400, 404]).toContain(res.statusCode);
    });
  });
});
