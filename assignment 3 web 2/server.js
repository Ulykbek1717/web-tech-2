require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

console.log("MONGODB_URI =", process.env.MONGODB_URI);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection with retry logic
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.error('  Common solutions:');
    console.error('  1. Whitelist your IP address in MongoDB Atlas Network Access');
    console.error('  2. Check if your connection string is correct');
    console.error('  3. Verify MongoDB cluster is active (not paused)');
    console.error('  4. Check firewall/VPN settings');
    console.error('\n  Server will continue running, but database operations will fail.');
  }
};

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});

// Connect to database
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'ShopLite API is running',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Health check endpoint

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

// 404 Handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: {
      message: 'API endpoint not found',
      status: 404
    }
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
