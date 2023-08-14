const router = require('express').Router()

const { User, Blog } = require('../models')

router.get('/', async (_req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] },
    },
  })
  res.json(users)
})

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create({ ...req.body, createdAt: new Date(), updatedAt: new Date() })
    res.json(user)
  } catch(error) {
    next(error)
  }
})

router.put('/:username', async (req, res) => {
  try {
    const { username } = req.params
    const { username: newUsername } = req.body

    const userToUpdate = await User.findOne({ where: { username } })
    if (!userToUpdate) {
      return res.status(404).json({ error: 'User not found' })
    }

    const existingUser = await User.findOne({ where: { username: newUsername } })
    if (existingUser) {
      return res.status(400).json({ error: 'Username already in use' })
    }

    const [updatedRowsCount] = await User.update(
      { username: newUsername },
      { where: { username }, returning: true }
    )
    console.log(updatedRowsCount)
    if (updatedRowsCount > 0) {
      const updatedUser = await User.findOne({
        where: { username: newUsername }
      })
      res.json(updatedUser)
    } else {
      res.status(500).json({ error: 'Failed to update user' })
    }
  } catch (error) {
    return res.status(400).end()
  }
})

module.exports = router
