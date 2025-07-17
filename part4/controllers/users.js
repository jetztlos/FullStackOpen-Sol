// controllers/users.js

const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

// POST create new user
usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body

  if (!password || password.length < 3) {
    return res.status(400).json({ error: 'password must be at least 3 characters long' })
  }

  if (!username || username.length < 3) {
    return res.status(400).json({ error: 'username must be at least 3 characters long' })
  }

  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return res.status(400).json({ error: 'username must be unique' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()
  res.status(201).json(savedUser)
})

// GET all users with populated blogs
usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 })
  res.json(users)
})

// GET single user by ID with validation and populated blogs
usersRouter.get('/:id', async (req, res) => {
  const id = req.params.id

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: 'Invalid user id' })
  }

  const user = await User.findById(id).populate('blogs', { title: 1, author: 1, url: 1 })

  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  res.json(user)
})

// PUT update a user's name by ID
usersRouter.put('/:id', async (req, res) => {
  const { name } = req.body

  if (!name || name.length < 3) {
    return res.status(400).json({ error: 'name must be at least 3 characters long' })
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true, context: 'query' }
    )

    if (!updatedUser) {
      return res.status(404).json({ error: 'user not found' })
    }

    res.json(updatedUser)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

module.exports = usersRouter
