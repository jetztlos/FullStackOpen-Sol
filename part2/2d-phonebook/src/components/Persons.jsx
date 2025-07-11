const Persons = ({ persons, onDelete }) => (
  <>
    {persons.map(person => (
      <p key={person.id}>
        {person.name} {person.number}
        <button onClick={() => onDelete(person.id, person.name)}>delete</button>
      </p>
    ))}
  </>
)

export default Persons
