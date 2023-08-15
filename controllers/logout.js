const router = require('express').Router()
const { tokenExtractor } = require('../utils/middleware')
const Session = require('../models/session')

router.delete('/', tokenExtractor, async (req, res, next) => {
  try {
    console.log(req.decodedToken.id)
    await Session.destroy({ where: { userId: req.decodedToken.id } })
    res.json({ message: 'Logged out successfully' })
  } catch (error) {
    next(error)
  }
})

module.exports = router