const Book = require('../models/bookModel');

// Function to fetch all books from the database
const getBooks = async (req, res) => {
  try {
    const books = await Book.find(); // Find all books in the database
    res.status(200).json(books); // Send the books back as JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching books.' }); // Error handling
  }
};

// Function to add a new book to the database
const addBook = async (req, res) => {
  try {
    const { title, author, year } = req.body; // Get book data from the request body

    // Create a new book document
    const newBook = new Book({
      title,
      author,
      year
    });

    // Save the new book to the database
    await newBook.save();
    res.status(201).json(newBook); // Return the new book as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding book.' }); // Error handling
  }
};

// Function to delete a book from the database
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params; // Get book ID from the URL parameters

    // Attempt to find and delete the book by ID
    const book = await Book.findByIdAndDelete(id);

    // If no book is found, return an error
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Return a success message if the book is deleted
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting book.' }); // Error handling
  }
};

module.exports = {
  getBooks,
  addBook,
  deleteBook // Export the deleteBook function
};
