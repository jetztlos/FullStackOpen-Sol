// part7/bloglist/backend/app.js

const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const testingRouter = require('./controllers/testing');
const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
const { addLoginUser } = require('./utils/test_helper');

// Set MongoDB strictQuery to false for compatibility with older queries
mongoose.set('strictQuery', false);

// Connect to MongoDB and handle errors
logger.info('connecting to', config.MONGODB_URI);
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');

    // Add the loginUser to the database if it doesn't exist
    addLoginUser()
      .then(() => {
        logger.info('Login user added to the database.');
      })
      .catch((error) => {
        logger.error('Error adding login user:', error.message);
      });
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message);
  });

// Middleware to handle CORS, JSON parsing, logging, token extraction, and error handling
app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

// Define routes for API endpoints
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

// If in 'test' environment, add testing routes
if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testingRouter);
}

// Middleware for handling unknown endpoints and errors
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
