const router = require('express').Router()
const { User, Blog } = require('../models')
const ReadingListBlogs = require('../models/reading_list_blogs')
const { tokenExtractor } = require('../utils/middleware')

router.post('/', async (req, res, next) => {
  const { userId, blogId } = req.body

  try {
    const user = await User.findByPk(userId)
    const blog = await Blog.findByPk(blogId)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' })
    }

    const newEntry = await ReadingListBlogs.create({ userId, blogId, read: false })
    res.json(newEntry)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', tokenExtractor, async (req, res, next) => {
  const entryId = req.params.id
  const { read } = req.body
  const userId = req.decodedToken.id

  try {
    const entry = await ReadingListBlogs.findOne({
      where: { id: entryId },
    })

    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' })
    }

    await entry.update({ read })

    res.json(entry)
  } catch (error) {
    next(error)
  }
})

module.exports = router