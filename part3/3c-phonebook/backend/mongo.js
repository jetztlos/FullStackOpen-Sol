// part3/3c-phonebook/backend/mongo.js

const mongoose = require('mongoose');
require('dotenv').config();  // Load environment variables

const url = process.env.MONGODB_URI;

console.log('Connecting to MongoDB with URI:', url);

mongoose.set('strictQuery', false);

mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  });

module.exports = mongoose;

