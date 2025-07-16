// part3/3d-phonebook/backend/index.js

require('dotenv').config()
require('./mongo')

const express = require('express')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(result => res.json(result))
    .catch(next)
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => person ? res.json(person) : res.status(404).end())
    .catch(next)
})

app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then(count => {
      res.send(`Phonebook has info for ${count} people\n\n${new Date()}`)
    })
    .catch(next)
})

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  const person = new Person({ name, number })
  person.save()
    .then(savedPerson => res.json(savedPerson))
    .catch(next)
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findByIdAndUpdate(req.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(result => result ? res.json(result) : res.status(404).end())
    .catch(next)
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch(next)
})

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

