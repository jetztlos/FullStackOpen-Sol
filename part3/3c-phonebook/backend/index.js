// part3/3c-phonebook/backend/index.js

require('./mongo');  // Database connection

const express = require('express');
const cors = require('cors');
const Person = require('./models/person');  // Import Person model
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Get all phonebook entries
app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(result => {
      res.json(result);
    })
    .catch(error => next(error));
});

// Get a specific phonebook entry by ID
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch(error => next(error));
});

// Get info about the phonebook
app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then(count => {
      const date = new Date();
      res.send(`Phonebook has info for ${count} people\n\n${date}`);
    })
    .catch(error => next(error));
});

// Add a new person to the phonebook
app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body;

  const person = new Person({ name, number });

  person.save()
    .then(savedPerson => {
      res.json(savedPerson);
    })
    .catch(error => {
      console.error('Failed to save person:', error.message);
      res.status(400).json({ error: error.message });
    });
});

// Update an existing person
app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body;

  const updatedPerson = {
    name,
    number,
  };

  Person.findByIdAndUpdate(req.params.id, updatedPerson, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        res.status(404).end();
      }
    })
    .catch(error => {
      console.error('Failed to update person:', error.message);
      res.status(400).json({ error: error.message });
    });
});

// Delete a person
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch(error => next(error));
});

// Unknown endpoint handler
const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

// Central error handler middleware
const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

