const errorHandler = (error, _request, response, next) => {
  console.error(error.message)
  
  if (error.name === 'SequelizeValidationError') {
    if (error.message.includes('Validation error')){
      return response.status(400).json({ error: 'Username must be a valid email address' })
    }
    return response.status(400).json({ error: 'Validation error: Invalid blog data' })
  }
  
  if (error.status === 404) {
    return response.status(404).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  errorHandler
}