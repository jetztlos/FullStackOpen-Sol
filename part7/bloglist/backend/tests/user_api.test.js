// part7/bloglist/backend/tests/user_api.test.js

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const User = require('../models/user')
const logger = require('../utils/logger')  // Import logger

beforeEach(async () => {
  try {
    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)
    logger.info('Test setup completed successfully for user tests')  // Log successful setup
  } catch (error) {
    logger.error('Error during user test setup:', error.message)  // Log errors if setup fails
  }
})

describe('creating a user', () => {
  test('should add new user if the username is unique and the password is long enough', async () => {
    try {
      const usersAtStart = await helper.usersInDb()

      await api
        .post('/api/users/')
        .send(helper.uniqueUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

      logger.info('New user created successfully')  // Log successful user creation
    } catch (error) {
      logger.error('Error creating new user:', error.message)  // Log errors during user creation
    }
  })

  test('should fail if the username is not unique', async () => {
    try {
      await api
        .post('/api/users/')
        .send(helper.notUniqueUser)
        .expect(400)

      logger.info('User creation failed due to non-unique username')  // Log validation error
    } catch (error) {
      logger.error('Error during user creation with non-unique username:', error.message)  // Log any errors
    }
  })

  test('should fail if the password is missing', async () => {
    try {
      await api
        .post('/api/users/')
        .send(helper.userWithOutPassword)
        .expect(400)

      logger.info('User creation failed due to missing password')  // Log validation error
    } catch (error) {
      logger.error('Error during user creation with missing password:', error.message)  // Log any errors
    }
  })

  test('should fail if the password is too short', async () => {
    try {
      await api
        .post('/api/users/')
        .send(helper.userWithTooShortPassword)
        .expect(400)

      logger.info('User creation failed due to short password')  // Log validation error
    } catch (error) {
      logger.error('Error during user creation with short password:', error.message)  // Log any errors
    }
  })
})

afterAll(async () => {
  try {
    await mongoose.connection.close()
    logger.info('User test execution completed')  // Log test completion
  } catch (error) {
    logger.error('Error closing MongoDB connection after user tests:', error.message)  // Log any errors during cleanup
  }
})
