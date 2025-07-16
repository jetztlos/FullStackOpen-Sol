const express = require('express');
const morgan = require('morgan');
const app = express();
const PORT = 3001;

// In-memory storage for the phonebook
let notes = [
  { id: '1', name: 'Arto Hellas', number: '040-123456' },
  { id: '2', name: 'Ada Lovelace', number: '39-44-5323523' },
  { id: '3', name: 'Dan Abramov', number: '12-43-234345' },
  { id: '4', name: 'Mary Poppendieck', number: '39-23-6423122' }
];

// Middleware to parse incoming JSON data
app.use(express.json());

// Morgan middleware for logging HTTP requests
app.use(morgan('tiny'));

// Custom logger for detailed request logging
const requestLogger = (req, res, next) => {
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Body:', req.body);
  console.log('---');
  next();
};
app.use(requestLogger);

// Route to get all phonebook entries
app.get('/api/persons', (req, res) => {
  res.json(notes);
});

// Route to get info about the phonebook
app.get('/info', (req, res) => {
  const now = new Date();
  res.send(`
    <h1>Phonebook Info</h1>
    <p>Phonebook has ${notes.length} entries.</p>
    <p>${now}</p>
  `);
});

// Route to get a single phonebook entry by ID
app.get('/api/persons/:id', (req, res) => {
  const { id } = req.params;
  const person = notes.find(note => note.id === id);
  
  if (person) {
    res.json(person);
  } else {
    res.status(404).send({ error: 'Person not found' });
  }
});

// Route to delete a phonebook entry by ID
app.delete('/api/persons/:id', (req, res) => {
  const { id } = req.params;
  const index = notes.findIndex(note => note.id === id);
  
  if (index !== -1) {
    notes.splice(index, 1);
    res.status(204).end(); // No content
  } else {
    res.status(404).send({ error: 'Person not found' });
  }
});

// Route to add a new phonebook entry
app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).send({ error: 'Name and number are required' });
  }

  // Check for duplicates
  if (notes.some(note => note.name === name)) {
    return res.status(400).send({ error: 'Name must be unique' });
  }

  const id = String(Math.floor(Math.random() * 10000)); // Random ID generation
  const newPerson = { id, name, number };
  notes.push(newPerson);

  res.json(newPerson);
});

// Route for handling unknown routes (404 error)
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
