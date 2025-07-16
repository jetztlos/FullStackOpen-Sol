// part3/3c-phonebook/frontend/src/App.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Phonebook from './components/Phonebook.jsx';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/api/persons')
      .then(response => setPersons(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Clear messages after 5 seconds
  const clearMessageAfterTimeout = () => {
    setTimeout(() => {
      setMessage(null);
      setErrorMessage(null);
    }, 5000);
  };

  const addPerson = (event) => {
    event.preventDefault();

    const existingPerson = persons.find(p => p.name === newName);

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook. Replace the old number with a new one?`
      );

      if (confirmUpdate) {
        const updatedPerson = { ...existingPerson, number: newNumber };

        axios.put(`http://localhost:3001/api/persons/${existingPerson.id}`, updatedPerson)
          .then(response => {
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : response.data));
            setMessage(`Updated ${newName}'s number`);
            clearMessageAfterTimeout();
          })
          .catch(error => {
            console.error('Failed to update contact:', error.response?.data || error.message);
            setErrorMessage(error.response?.data?.error || 'Failed to update contact');
            clearMessageAfterTimeout();
          });
      }
    } else {
      const newPerson = { name: newName, number: newNumber };

      axios.post('http://localhost:3001/api/persons', newPerson)
        .then(response => {
          setPersons(persons.concat(response.data));
          setMessage(`Added ${newName}`);
          clearMessageAfterTimeout();
        })
        .catch(error => {
          console.error('Failed to add contact:', error.response?.data || error.message);
          setErrorMessage(error.response?.data?.error || 'Failed to add contact');
          clearMessageAfterTimeout();
        });
    }

    setNewName('');
    setNewNumber('');
  };

  const handleDelete = (id) => {
    const person = persons.find(p => p.id === id);

    if (!person) return;

    const confirmDelete = window.confirm(`Delete ${person.name}?`);

    if (confirmDelete) {
      axios.delete(`http://localhost:3001/api/persons/${id}`)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id));
          setMessage(`Deleted ${person.name}`);
          clearMessageAfterTimeout();
        })
        .catch(error => {
          console.error('Failed to delete contact:', error.response?.data || error.message);
          setErrorMessage(error.response?.data?.error || 'Failed to delete contact');
          clearMessageAfterTimeout();
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>

      {message && <div style={{ color: 'green' }}>{message}</div>}
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

      <form onSubmit={addPerson}>
        <div>
          Name: <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
            minLength={3}
          />
        </div>
        <div>
          Number: <input
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
            required
            minLength={8}
          />
        </div>
        <button type="submit">Add</button>
      </form>

      <Phonebook persons={persons} onDelete={handleDelete} />
    </div>
  );
};

export default App;

