"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    static associate(models) {
      Book.belongsTo(models.Genre, { foreignKey: "genreId", as: "Genre" });
      Book.hasMany(models.BorrowingRecord, { foreignKey: "bookId", as: "BorrowingRecords" });
    }
  }

  Book.init(
    {
      title: DataTypes.STRING,
      bookImg: DataTypes.STRING,
      author: DataTypes.STRING,
      isbn: DataTypes.STRING,
      publishedYear: DataTypes.INTEGER,
      genreId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      available: DataTypes.INTEGER,
    },
    { sequelize, modelName: "Book" }
  );

  return Book;
};
