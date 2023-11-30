const db = require("../models");
const {
  createGenreImageDBPath,
  extractFilenameFromDBPath,
  getAbsoluteGenreImagePath,
} = require("../utils/filePathMulter");
const fs = require("fs").promises;
const path = require("path");

module.exports = {
  async createGenre(req, res) {
    const { genreName } = req.body;

    const t = await db.sequelize.transaction();

    try {
      if (!req.file?.filename) {
        return res.status(400).send({
          message: "Image is required",
        });
      }

      const genreImg = createGenreImageDBPath(req.file?.filename);
      const newGenre = await db.Genre.create(
        {
          genreName,
          genreImg,
        },
        { transaction: t }
      );

      await t.commit();

      return res.status(201).json({
        message: "Genre created successfully",
        data: newGenre,
      });
    } catch (error) {
      await t.rollback();
      res.status(500).json({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },

  async getAllGenres(req, res) {
    try {
      const genres = await db.Genre.findAll({
        attributes: ['id', 'genreName', 'genreImg'],
      });

      res.status(200).json({
        message: "Genres retrieved successfully",
        data: genres
      });
    } catch (error) {
      console.error("Error fetching genres: ", error);
      res.status(500).json({
        message: "Error retrieving genres",
        error: error.message
      });
    }
  },
};
