// part7/bloglist/backend/controllers/users.js

const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const logger = require('../utils/logger')  // Import logger

usersRouter.get('/', async (request, response) => {
  try {
    const users = await User
      .find({})
      .populate('blogs', { title: 1, author: 1, url: 1 })
    response.json(users)
  } catch (error) {
    logger.error('Error fetching users:', error.message)  // Log error
    response.status(500).send('Internal Server Error')
  }
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!password || password.length < 3) {
    return response.status(400).json({
      error: 'password with at least 3 characters is required'
    })
  }

  try {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
  } catch (error) {
    logger.error('Error creating user:', error.message)  // Log error
    response.status(500).send('Internal Server Error')
  }
})

module.exports = usersRouter
