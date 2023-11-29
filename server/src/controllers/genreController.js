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
    const { name } = req.body;

    const t = await db.sequelize.transaction();

    try {
      if (!req.file?.filename) {
        return res.status(400).send({
          message: "Image is required",
        });
      }

      const genreImg = createGenreImageDBPath(req.file?.filename);
      console.log("kena ini");
      console.log("ini genre img", genreImg);

      const newGenre = await db.Genre.create(
        {
          name,
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
};
