'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdminAction extends Model {
    static associate(models) {
      AdminAction.belongsTo(models.BorrowingRecord, {
        foreignKey: 'recordId',
        as: 'BorrowingRecord'
      });
    }
  }
  AdminAction.init({
    recordId: DataTypes.INTEGER,
    actionDate: DataTypes.DATE,
    action: DataTypes.ENUM('Approve', 'Verify Returned', 'Reject'),
    notes: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'AdminAction',
  });
  return AdminAction;
};