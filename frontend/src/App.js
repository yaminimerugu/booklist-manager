import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [books, setBooks] = useState([]); // State to store the list of books
  const [book, setBook] = useState({ title: '', author: '', year: '' }); // State to store the current book
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const [successMessage, setSuccessMessage] = useState(''); // State for success messages

  // Fetch books from the API
  const fetchBooks = async () => {
    try {
      const res = await axios.get('http://52.91.45.31:5000/books');
      console.log(res.data); // Log the response to check the data structure
      setBooks(res.data);
    } catch (error) {
      setErrorMessage('Error fetching books.');
      console.error(error); // Log error for debugging
    }
  };

  // Add a new book to the API
  const addBook = async () => {
    if (!book.title || !book.author || !book.year) {
      setErrorMessage('All fields must be filled out.');
      return;
    }

    try {
      await axios.post('http://52.91.45.31:5000/books', book);
      fetchBooks(); // Fetch updated list after adding the book
      setSuccessMessage('Book added successfully!');
      setBook({ title: '', author: '', year: '' }); // Reset input fields after adding a book
    } catch (error) {
      setErrorMessage('Error adding book.');
      console.error(error); // Log error for debugging
    }
  };

  // Delete a book by its ID
  const deleteBook = async (id) => {
    try {
      await axios.delete(`http://52.91.45.31:5000/books/${id}`);
      fetchBooks(); // Fetch updated list after deleting the book
      setSuccessMessage('Book deleted successfully!');
    } catch (error) {
      setErrorMessage('Error deleting book.');
      console.error(error); // Log error for debugging
    }
  };

  // Fetch books when the component mounts
  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div>
      <h2>Book List</h2>

      {/* Display success/error messages */}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {/* Input fields for adding a book */}
      <input
        placeholder="Title"
        value={book.title}
        onChange={e => setBook({ ...book, title: e.target.value })}
      />
      <input
        placeholder="Author"
        value={book.author}
        onChange={e => setBook({ ...book, author: e.target.value })}
      />
      <input
        placeholder="Year"
        value={book.year}
        onChange={e => setBook({ ...book, year: e.target.value })}
      />
      <button onClick={addBook}>Add</button>

      {/* Book list display */}
      <ul>
        {books.map(b => (
          <li key={b._id}>
            {b.title} - {b.year}
            <button onClick={() => deleteBook(b._id)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
