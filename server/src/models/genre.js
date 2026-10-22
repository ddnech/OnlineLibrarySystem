'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Genre extends Model {
    static associate(models) {
      Genre.hasMany(models.Book, {
        foreignKey: 'genreId',
        as: 'Books'
      });
    }
  }
  Genre.init({
    genreName: DataTypes.STRING,
    genreImg: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Genre',
  });
  return Genre;
};