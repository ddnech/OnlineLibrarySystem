"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class BorrowingRecord extends Model {
    static associate(models) {
      BorrowingRecord.belongsTo(models.Book, { foreignKey: "bookId", as: "Book" });
      BorrowingRecord.belongsTo(models.User, { foreignKey: "userId", as: "User" });
      BorrowingRecord.hasMany(models.AdminAction, { foreignKey: "recordId", as: "AdminActions" });
    }
  }

  BorrowingRecord.init(
    {
      userId: DataTypes.INTEGER,
      bookId: DataTypes.INTEGER,
      borrowDate: DataTypes.DATE,
      dueDate: DataTypes.DATE,
      returnDate: DataTypes.DATE,
      bookStatus: DataTypes.ENUM("Pending", "Borrowed", "Return Pending", "Returned", "Rejected"),
      overdue: DataTypes.BOOLEAN,
    },
    { sequelize, modelName: "BorrowingRecord" }
  );

  return BorrowingRecord;
};
