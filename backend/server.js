const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bookRoutes = require('./routes/bookRoutes'); // Adjust path if needed

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Important: Parses incoming JSON requests

// MongoDB connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookdb';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Route middleware
app.use('/books', bookRoutes);

// Root route (optional)
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).send('Backend is healthy');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something went wrong!' });
});

// Server listening
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ✅ Export app for testing
module.exports = app;
