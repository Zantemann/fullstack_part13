const Blog = require('./blog')
const User = require('./user')
const ReadingListBlogs = require('./reading_list_blogs')
const Session = require('./session')

User.hasMany(Blog)
Blog.belongsTo(User)
User.belongsToMany(Blog, { through: ReadingListBlogs, as: 'markedBlogs' })
Blog.belongsToMany(User, { through: ReadingListBlogs, as: 'usersMarked' })

Session.belongsTo(User)

module.exports = {
  Blog, User
}