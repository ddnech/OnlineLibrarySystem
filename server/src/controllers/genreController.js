const db = require("../models");

module.exports = {
  async list(req, res) {
    const genres = await db.Genre.findAll({
      attributes: ["id", "genreName", "genreImg"],
      order: [["genreName", "ASC"]],
    });
    res.json({ message: "Genres retrieved successfully", data: genres });
  },

  async create(req, res) {
    const genre = await db.Genre.create({
      genreName: req.body.genreName,
      genreImg: req.uploadedPath || null,
    });
    res.status(201).json({ message: `Genre "${genre.genreName}" added.`, data: genre });
  },
};
