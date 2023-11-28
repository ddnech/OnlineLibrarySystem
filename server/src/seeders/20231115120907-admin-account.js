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
    const password = await Password("Password123!");
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const pw = await Password("!Password1");
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          username: "admin_library",
          roles: "admin",
          email: "admin@gmail.com",
          address:"test132",
          password: pw,
          fullName:"Admin something",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: "user1",
          roles: "user",
          email: "usern@gmail.com",
          address:"test132",
          password: pw,
          fullName:"user something",
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
