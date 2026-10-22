"use strict";

const GENRES = ["Fiction", "Non-Fiction", "Mystery", "Fantasy", "Science", "History"];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert(
      "Genres",
      GENRES.map((genreName) => ({ genreName, genreImg: null, createdAt: now, updatedAt: now }))
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Genres", { genreName: { [Sequelize.Op.in]: GENRES } });
  },
};
