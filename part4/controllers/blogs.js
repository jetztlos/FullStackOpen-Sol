// part4/controllers/blogs.js

// part4/controllers/blogs.js

const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

// Get all blogs (5.1, 5.15)
blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
    .sort({ likes: -1 })
  res.json(blogs)
})

// Get single blog by ID (5.23)
blogsRouter.get('/:id', async (req, res, next) => {
  const id = req.params.id
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: 'Invalid blog id' })
  }

  try {
    const blog = await Blog
      .findById(id)
      .populate('user', { username: 1, name: 1 })
    if (!blog) {
      return res.status(404).end()
    }
    res.json(blog)
  } catch (error) {
    next(error)
  }
})

// Create new blog (5.4, 5.11, 5.12, 5.13)
blogsRouter.post('/', middleware.userExtractor, async (req, res) => {
  const body = req.body
  const user = req.user

  if (!user) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }
  if (!body.title || !body.url) {
    return res.status(400).json({ error: 'title or url missing' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  const saved = await blog.save()
  user.blogs = user.blogs.concat(saved._id)
  await user.save()
  const populated = await Blog.findById(saved._id).populate('user', { username: 1, name: 1 })

  res.status(201).json(populated)
})

// Update blog (5.5, 5.14)
blogsRouter.put('/:id', async (req, res, next) => {
  const id = req.params.id
  const body = req.body

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: 'Invalid blog id' })
  }

  const update = {}
  if (body.likes !== undefined) update.likes = body.likes
  if (body.title !== undefined) update.title = body.title
  if (body.author !== undefined) update.author = body.author
  if (body.url !== undefined) update.url = body.url

  try {
    const updated = await Blog
      .findByIdAndUpdate(id, update, { new: true, runValidators: true, context: 'query' })
      .populate('user', { username: 1, name: 1 })
    if (!updated) {
      return res.status(404).json({ error: 'Blog not found' })
    }
    res.json(updated)
  } catch (error) {
    next(error)
  }
})

// Delete blog (5.6, 5.19)
blogsRouter.delete('/:id', middleware.userExtractor, async (req, res, next) => {
  const user = req.user
  const blog = await Blog.findById(req.params.id)

  if (!blog) {
    return res.status(404).json({ error: 'blog not found' })
  }
  if (!user || blog.user.toString() !== user._id.toString()) {
    return res.status(401).json({ error: 'unauthorized' })
  }

  await Blog.findByIdAndRemove(req.params.id)
  user.blogs = user.blogs.filter(b => b.toString() !== req.params.id)
  await user.save()
  res.status(204).end()
})

module.exports = blogsRouter
