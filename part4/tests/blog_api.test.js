// part4/tests/blog_api.test.js

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
  await User.deleteMany({})
  await User.insertMany([])

  await helper.addLoginUser() // adds loginUser
})

describe('reading the blogs', () => {
  test('should return blogs as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('should return correct amount of blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('should return blogs with right unique identifier property', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach((blog) => {
      expect(blog.id).toBeDefined()
      expect(blog._id).toBeUndefined()
    })
  })
})

describe('creating of a new blog', () => {
  test('should add one blog that has the right content', async () => {
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
  })

  test('should add a blog with zero likes if the likes property is missing', async () => {
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
  })

  test('should fail if the title property is missing', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const loggedUser = await api.post('/api/login').send(helper.loginUser)

    await api
      .post('/api/blogs/')
      .set('Authorization', `Bearer ${loggedUser.body.token}`)
      .send(helper.blogWithoutTitle)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  })

  test('should fail if the url property is missing', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const loggedUser = await api.post('/api/login').send(helper.loginUser)

    await api
      .post('/api/blogs/')
      .set('Authorization', `Bearer ${loggedUser.body.token}`)
      .send(helper.blogWithoutUrl)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  })

  // ✅ NEW TEST: blog creation fails without token (Exercise 4.19)
  test('should fail with status 401 if token is not provided', async () => {
    const blogsAtStart = await helper.blogsInDb()

    await api
      .post('/api/blogs')
      .send(helper.newBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  })
})

describe('updating of a blog', () => {
  test('should update details of an existing blog successfully', async () => {
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
  })
})

describe('deletion of a blog', () => {
  test('should succeed with status code 204 if id is valid and owned by user', async () => {
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
  })

  // ✅ NEW TEST: deletion fails if not the blog owner (Exercise 4.21)
  test('should fail with 401 if user is not the owner of the blog', async () => {
    const loggedUser = await api.post('/api/login').send(helper.loginUser)

    const blogToDelete = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loggedUser.body.token}`)
      .send(helper.newBlog)

    // Create a different user (not the blog owner)
    const otherUser = {
      username: 'otheruser',
      password: 'otherpassword',
    }

    await api.post('/api/users').send(otherUser)
    const otherUserLogin = await api.post('/api/login').send(otherUser)

    await api
      .delete(`/api/blogs/${blogToDelete.body.id}`)
      .set('Authorization', `Bearer ${otherUserLogin.body.token}`)
      .expect(401)

    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter.map(b => b.id)).toContain(blogToDelete.body.id)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
