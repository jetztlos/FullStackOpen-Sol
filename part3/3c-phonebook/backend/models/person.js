// part3/3c-phonebook/backend/models/person.js

const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Person name required'],
    minlength: [3, 'Name must be at least 3 characters long'],
  },
  number: {
    type: String,
    required: [true, 'Number required'],
    minlength: [8, 'Number must be at least 8 characters long'],
  }
});

// Transform _id to id and remove __v when returning JSON
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Person', personSchema);

