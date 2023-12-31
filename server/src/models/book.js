'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Book.belongsTo(models.Genre, {
        foreignKey: 'genreId',
        as: 'Genre'
      });
      
    }
  }
  Book.init({
    title: DataTypes.STRING,
    bookImg: DataTypes.STRING,
    author: DataTypes.STRING,
    isbn: DataTypes.STRING,
    publishedYear: DataTypes.INTEGER,
    genreId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    avalaible: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};