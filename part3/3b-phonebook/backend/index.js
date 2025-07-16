const express = require('express');
const cors = require('cors');  // Import CORS
const app = express();
const PORT = 3001;

// Enable CORS
app.use(cors()); // This will allow your frontend to communicate with your backend

// Middleware to handle JSON requests
app.use(express.json());

// In-memory "database" for phonebook entries
let phonebook = [
    { id: 1, name: 'John Doe', number: '123-456-7890' },
    { id: 2, name: 'Jane Smith', number: '987-654-3210' },
];

// Root endpoint
app.get('/', (req, res) => {
    res.send('Hello, backend is working!');
});

// Endpoint to get all phonebook entries
app.get('/api/persons', (req, res) => {
    res.json(phonebook);
});

// Endpoint to get the information of a specific person by ID
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = phonebook.find(p => p.id === id);
    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
    console.log('Fetching persons data');  // Debug log
    res.json(phonebook);
});

// Endpoint to get the number of people in the phonebook
app.get('/api/info', (req, res) => {
    const count = phonebook.length;
    const date = new Date();
    res.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${date}</p>
    `);
});

// Endpoint to add a new person to the phonebook
app.post('/api/persons', (req, res) => {
    const body = req.body;

    // Basic validation to check for name and number
    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'name or number missing' });
    }

    // Check for duplicate names
    if (phonebook.find(p => p.name === body.name)) {
        return res.status(400).json({ error: 'name must be unique' });
    }

    const newPerson = {
        id: phonebook.length + 1,
        name: body.name,
        number: body.number,
    };

    phonebook = phonebook.concat(newPerson);
    res.json(newPerson);
});

// Starting the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
