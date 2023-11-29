'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BorrowingRecord extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BorrowingRecord.init({
    userId: DataTypes.INTEGER,
    bookId: DataTypes.INTEGER,
    borrowDate: DataTypes.DATE,
    dueDate: DataTypes.DATE,
    returnDate: DataTypes.DATE,
    bookStatus: DataTypes.ENUM('Pending', 'Rejected', 'Borrowed', 'Return Pending', 'Returned'),
  }, {
    overdue: DataTypes.BOOLEAN,
    sequelize,
    modelName: 'BorrowingRecord',
  });
  return BorrowingRecord;
};