const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class ReadingListBlogs extends Model {}

ReadingListBlogs.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    blogId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'blogs', key: 'id' },
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'readingListBlogs',
})

module.exports = ReadingListBlogs