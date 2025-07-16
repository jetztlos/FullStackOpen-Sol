// part3/3c-phonebook/frontend/src/components/Phonebook.jsx

const Phonebook = ({ persons, onDelete }) => {
  return (
    <div>
      <ul>
        {persons.map(person => (
          <li key={person.id}>
            {person.name} {person.number}
            <button onClick={() => onDelete(person.id)} style={{ marginLeft: 8 }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Phonebook;

