const db = require("../models");

module.exports = {
  getOneGenre: async (filter) => {
    try {
      const result = await db.Genre.findOne({
        where: filter,
        attributes: ["id", "genreName"],
      });

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  async getAllGenres(page = 1, pageSize = 10) {
    const queryOptions = {
      attributes: ["id", "genreName"],
      offset: (page - 1) * pageSize,
      limit: pageSize,
    };

    try {
      const results = await db.Genre.findAll(queryOptions);
      const totalItems = await db.Genre.count();

      return {
        success: true,
        data: results,
        pagination: {
          page: page,
          pageSize: pageSize,
          totalItems: totalItems,
          totalPages: Math.ceil(totalItems / pageSize),
        },
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: error.message,
      };
    }
  },
};
