const PersonForm = ({ newName, newNumber, setNewName, setNewNumber, handleAddPerson }) => {
  return (
    <form onSubmit={handleAddPerson}>
      <div>
        name: 
        <input 
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
      </div>
      <div>
        number:
        <input 
          value={newNumber}
          onChange={(e) => setNewNumber(e.target.value)}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default PersonForm
