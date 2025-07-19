// part7/bloglist/backend/controllers/login.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');
const logger = require('../utils/logger');  // Adding logger for debugging

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body;

  // Check if username or password is missing
  if (!username || !password) {
    logger.warn('Missing username or password in request body');
    return response.status(400).json({
      error: 'Username and password are required',
    });
  }

  logger.info('Received login request for username:', username);

  try {
    // Step 1: Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      logger.warn('User not found:', username);
      return response.status(401).json({
        error: 'invalid username or password',
      });
    }

    // Step 2: Compare the password with the stored hash
    const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!passwordCorrect) {
      logger.warn('Incorrect password for user:', username);
      return response.status(401).json({
        error: 'invalid username or password',
      });
    }

    // Step 3: Create JWT token for the authenticated user
    const userForToken = {
      username: user.username,
      id: user._id,
    };

    // Sign the token
    const token = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: 60 * 60, // 1 hour expiry
    });

    // Step 4: Send back the response with the token and user info
    logger.info('Login successful for user:', username);
    response.status(200).send({
      token,
      username: user.username,
      name: user.name,
    });
  } catch (error) {
    logger.error('Error during login process:', error.message);
    response.status(500).json({
      error: 'Something went wrong with the server',
    });
  }
});

module.exports = loginRouter;
