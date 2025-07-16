import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');

  // Fetch the current list of persons when the component mounts
  useEffect(() => {
    fetch('/api/persons')
      .then(response => response.json())
      .then(data => setPersons(data));
  }, []);

  // Handle form submission to add a new person to the phonebook
  const addPerson = (event) => {
    event.preventDefault();
    const newPerson = { name: newName, number: newNumber };

    // Send the new person to the backend
    fetch('/api/persons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPerson),
    })
      .then(response => response.json())
      .then(data => {
        setPersons(persons.concat(data)); // Update the state with the new person
        setNewName('');
        setNewNumber('');
      });
  };

  return (
    <div className="App">
      <h1>Phonebook</h1>

      <form onSubmit={addPerson} className="form">
        <div>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Name"
            className="input"
          />
        </div>
        <div>
          <input
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
            placeholder="Number"
            className="input"
          />
        </div>
        <button type="submit" className="submit-button">Add</button>
      </form>

      <h2>Numbers</h2>
      <ul>
        {persons.map(person => (
          <li key={person.id} className="person">
            {person.name} - {person.number}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
