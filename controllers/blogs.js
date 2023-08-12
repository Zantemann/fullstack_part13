const router = require('express').Router()
const { Blog } = require('../models')

const blogFinder = async (req, _res, next) => {
  const blogId = req.params.id
  try {
    req.blog = await Blog.findByPk(blogId)

    if (!req.blog) {
      const error = new Error(`Blog not found with ID: ${blogId}`)
      error.status = 404
      throw error
    }

    next()
  } catch (error) {
    next(error)
  }
}

router.get('/', async (_req, res) => {
  const blogs = await Blog.findAll()
  console.log(JSON.stringify(blogs, null, 2))
  res.json(blogs)
})

router.delete('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    await req.blog.destroy()
  }
  res.status(204).end()
})

router.put('/:id', blogFinder, async (req, res, next) => {
  try {
    if (req.blog) {
      req.blog.likes += 1
      await req.blog.save()
      res.json(req.blog)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const blog = await Blog.create(req.body)
    res.json(blog)
  } catch(error) {
    next(error)
  }
})

module.exports = router