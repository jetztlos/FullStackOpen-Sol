// part7/ultimate-hooks/src/App.jsx

import useField from './hooks/useField'
import useResource from './hooks/useResource'

const App = () => {
  const content = useField('text')
  const name = useField('text')
  const number = useField('text')

  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')

  const handleNoteSubmit = (event) => {
    event.preventDefault()
    console.log('Submitting note:', content.value)
    noteService.create({ content: content.value })
    content.onReset()
  }

  const handlePersonSubmit = (event) => {
    event.preventDefault()
    console.log('Submitting person:', name.value, number.value)
    personService.create({ name: name.value, number: number.value })
    name.onReset()
    number.onReset()
  }

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} />
        <button>create</button>
      </form>
      {Array.isArray(notes) && notes.length > 0 ? (
        notes.map(n => <p key={n.id}>{n.content}</p>)
      ) : (
        <p>No notes available</p>
      )}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name} /> <br />
        number <input {...number} />
        <button>create</button>
      </form>
      {Array.isArray(persons) && persons.length > 0 ? (
        persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)
      ) : (
        <p>No persons available</p>
      )}
    </div>
  )
}

export default App
