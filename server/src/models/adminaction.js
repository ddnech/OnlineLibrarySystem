'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdminAction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      AdminAction.belongsTo(models.BorrowingRecord, {
        foreignKey: 'recordId',
        as: 'BorrowingRecord'
      });
    }
  }
  AdminAction.init({
    recordId: DataTypes.INTEGER,
    actionDate: DataTypes.DATE,
    action: DataTypes.ENUM('Approve','Verify Returned'),
    notes: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'AdminAction',
  });
  return AdminAction;
};