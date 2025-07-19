// part7/bloglist/backend/tests/blog_api.test.js

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')  // Import logger

beforeEach(async () => {
  try {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
    await User.deleteMany({})
    await User.insertMany([])

    logger.info('Test setup completed successfully')  // Log successful setup

    // Add a test user (helper function)
    await helper.addLoginUser()
  } catch (error) {
    logger.error('Error during test setup:', error.message)  // Log any setup errors
  }
})

describe('reading the blogs', () => {
  test('should return blogs as json', async () => {
    try {
      const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      logger.info('Blogs fetched successfully')  // Log successful fetch
    } catch (error) {
      logger.error('Error fetching blogs:', error.message)  // Log errors if fetching fails
    }
  })

  test('should return correct amount of blogs', async () => {
    try {
      const response = await api.get('/api/blogs')
      expect(response.body).toHaveLength(helper.initialBlogs.length)
      logger.info('Correct amount of blogs returned')  // Log successful check
    } catch (error) {
      logger.error('Error checking the amount of blogs:', error.message)  // Log errors if check fails
    }
  })

  test('should return blogs with right unique identifier property', async () => {
    try {
      const response = await api.get('/api/blogs')
      response.body.forEach((blog) => {
        expect(blog.id).toBeDefined()
        expect(blog._id).toBeUndefined()
      })
      logger.info('Blogs with unique identifier returned successfully')  // Log successful identifier check
    } catch (error) {
      logger.error('Error checking unique identifier for blogs:', error.message)  // Log errors if check fails
    }
  })
})

describe('creating a new blog', () => {
  test('should add one blog that has the right content', async () => {
    try {
      const blogsAtStart = await helper.blogsInDb()
      const loggedUser = await api.post('/api/login').send(helper.loginUser)

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${loggedUser.body.token}`)
        .send(helper.newBlog)

      const newBlog = response.body
      const blogsAtEnd = await helper.blogsInDb()

      expect(newBlog.title).toEqual(helper.newBlog.title)
      expect(newBlog.author).toEqual(helper.newBlog.author)
      expect(newBlog.url).toEqual(helper.newBlog.url)
      expect(newBlog.user.username).toEqual(loggedUser.body.username)
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)

      logger.info('New blog added successfully')  // Log successful blog creation
    } catch (error) {
      logger.error('Error creating new blog:', error.message)  // Log any errors during creation
    }
  })

  test('should add a blog with zero likes if the likes property is missing', async () => {
    try {
      const blogsAtStart = await helper.blogsInDb()
      const loggedUser = await api.post('/api/login').send(helper.loginUser)

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${loggedUser.body.token}`)
        .send(helper.newBlogWithoutLikes)

      const newBlog = response.body
      const blogsAtEnd = await helper.blogsInDb()

      expect(newBlog.likes).toBe(0)
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)

      logger.info('Blog added with zero likes successfully')  // Log successful blog creation with zero likes
    } catch (error) {
      logger.error('Error adding blog with zero likes:', error.message)  // Log any errors during creation
    }
  })

  test('should fail if the title property is missing', async () => {
    try {
      const blogsAtStart = await helper.blogsInDb()
      const loggedUser = await api.post('/api/login').send(helper.loginUser)

      await api
        .post('/api/blogs/')
        .set('Authorization', `Bearer ${loggedUser.body.token}`)
        .send(helper.blogWithoutTitle)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length)

      logger.info('Test passed: Blog without title correctly failed')  // Log success for validation
    } catch (error) {
      logger.error('Error during blog creation without title:', error.message)  // Log any errors if the test fails
    }
  })

  test('should fail if the url property is missing', async () => {
    try {
      const blogsAtStart = await helper.blogsInDb()
      const loggedUser = await api.post('/api/login').send(helper.loginUser)

      await api
        .post('/api/blogs/')
        .set('Authorization', `Bearer ${loggedUser.body.token}`)
        .send(helper.blogWithoutUrl)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length)

      logger.info('Test passed: Blog without URL correctly failed')  // Log success for validation
    } catch (error) {
      logger.error('Error during blog creation without URL:', error.message)  // Log any errors if the test fails
    }
  })
})

describe('updating a blog', () => {
  test('should update details of an existing blog successfully', async () => {
    try {
      const blogsAtStart = await helper.blogsInDb()
      const blogToBeUpdated = { ...blogsAtStart[0] }
      blogToBeUpdated.likes++

      await api
        .put(`/api/blogs/${blogToBeUpdated.id}`)
        .send(blogToBeUpdated)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

      const updatedBlog = blogsAtEnd.find(
        (blog) => blog.id === blogToBeUpdated.id
      )
      expect(updatedBlog).toEqual(blogToBeUpdated)

      logger.info('Blog updated successfully')  // Log successful blog update
    } catch (error) {
      logger.error('Error updating blog:', error.message)  // Log any errors during the update
    }
  })
})

describe('deletion of a blog', () => {
  test('should succeed with status code 204 if id is valid', async () => {
    try {
      const blogsAtStart = await helper.blogsInDb()
      const loggedUser = await api.post('/api/login').send(helper.loginUser)

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${loggedUser.body.token}`)
        .send(helper.newBlog)

      const blogsAfterAddition = await helper.blogsInDb()

      await api
        .delete(`/api/blogs/${response.body.id}`)
        .set('Authorization', `Bearer ${loggedUser.body.token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAfterAddition).toHaveLength(blogsAtStart.length + 1)
      expect(blogsAtEnd).toHaveLength(blogsAfterAddition.length - 1)

      logger.info('Blog deleted successfully')  // Log successful blog deletion
    } catch (error) {
      logger.error('Error deleting blog:', error.message)  // Log any errors during the deletion
    }
  })
})

afterAll(async () => {
  await mongoose.connection.close()
  logger.info('Test execution completed')  // Log test completion
})
