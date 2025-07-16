// part3/3c-phonebook/backend/testMongoConnection.js

const mongoose = require('mongoose');
require('dotenv').config();  // Ensure dotenv is loaded

const url = process.env.MONGODB_URI;

mongoose.connect(url)
  .then(() => {
    console.log('Test Connection to MongoDB successful');
  })
  .catch((error) => {
    console.error('Test Connection Failed:', error.message);
  });
