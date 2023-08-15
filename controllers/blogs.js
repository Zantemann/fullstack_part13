const router = require('express').Router()
const { Blog, User } = require('../models')

const { Op } = require('sequelize')
const { tokenExtractor } = require('../utils/middleware')

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

router.get('/', async (req, res) => {
  const where = {}

  if (req.query.search){
    const searchKeyword = `%${req.query.search}%`

    where[Op.or] = [
      { title: { [Op.iLike]: searchKeyword } },
      { author: { [Op.iLike]: searchKeyword } }
    ]
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
    where,
    order: [
      ['likes', 'DESC']
    ]
  })
  console.log(JSON.stringify(blogs, null, 2))
  res.json(blogs)
})

router.delete('/:id', blogFinder, async (req, res) => {
  try {
    if (req.blog) {
      if(req.decodedToken && req.decodedToken.id === req.blog.userId){
        await req.blog.destroy()
      } else {
        return res.status(401).json({ error: 'no access to delete blog' })
      }
    }
    res.status(204).end()
  } catch (error) {
    res.status(404).end()
  }
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

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({ ...req.body, userId: user.id, 
      createdAt: new Date(), updatedAt: new Date() })
    res.json(blog)
  } catch(error) {
    next(error)
  }
})

module.exports = router