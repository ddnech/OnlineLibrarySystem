"use strict";

const bcrypt = require("bcryptjs");

// Demo accounts. Every account uses the same password: Password12
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const password = await bcrypt.hash("Password12", 10);
    const now = new Date();

    await queryInterface.bulkInsert("Users", [
      {
        username: "admin",
        roles: "admin",
        email: "adminlibrary@gmail.com",
        address: "Library front desk",
        password,
        fullName: "Admin Library",
        createdAt: now,
        updatedAt: now,
      },
      {
        username: "user1",
        roles: "user",
        email: "usern@gmail.com",
        address: "Jl. Melawai No. 1, Jakarta",
        password,
        fullName: "Demo Reader",
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", {
      username: { [Sequelize.Op.in]: ["admin", "user1"] },
    });
  },
};
