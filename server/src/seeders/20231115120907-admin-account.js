"use strict";

const bcrypt = require("bcrypt");

const Password = async (pass) => {
  let salt = await bcrypt.genSalt(10);
  let hashed = await bcrypt.hash(pass, salt);
  return hashed;
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const password = await Password("Password12");
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          username: "admin",
          roles: "admin",
          email: "adminlibrary@gmail.com",
          address:"test",
          password: password,
          fullName:"Admin Library",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: "user1",
          roles: "user",
          email: "usern@gmail.com",
          address:"test",
          password: password,
          fullName:"Username",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Users", null, {});
  },
};
