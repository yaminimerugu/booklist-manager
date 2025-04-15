const express = require('express');
const router = express.Router();
const Book = require('../models/book');

// Add a new book
router.post('/', async (req, res) => {
  try {
    const { title, author, year } = req.body;
    const newBook = new Book({ title, author, year });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: 'Error adding book', error: error.message });
  }
});

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books' });
  }
});

// Delete a book by its ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id); // Find and delete the book by ID

    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting book', error: error.message });
  }
});

module.exports = router;
