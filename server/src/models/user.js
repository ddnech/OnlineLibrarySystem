"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.BorrowingRecord, { foreignKey: "userId", as: "BorrowingRecords" });
    }

    // Never send the password hash back to the client.
    toJSON() {
      const values = { ...this.get() };
      delete values.password;
      return values;
    }
  }

  User.init(
    {
      username: DataTypes.STRING,
      roles: DataTypes.ENUM("admin", "user"),
      email: DataTypes.STRING,
      address: DataTypes.STRING,
      password: DataTypes.STRING,
      fullName: DataTypes.STRING,
    },
    { sequelize, modelName: "User" }
  );

  return User;
};
