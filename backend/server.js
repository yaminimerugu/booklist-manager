const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bookRoutes = require('./routes/bookRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookdb';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/books', bookRoutes);

app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.get('/health', (req, res) => {
  res.status(200).send('Backend is healthy');
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something went wrong!' });
});

// ✅ Function to start server (used in normal app run)
let server;
const startServer = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');
    server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
  }
};

// 🔁 Only start server if NOT in test environment
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

// ✅ Export for testing
module.exports = { app, server, startServer };
