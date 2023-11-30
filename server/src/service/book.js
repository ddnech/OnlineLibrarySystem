const db = require("../models");

module.exports = {
  getOneBook: async (filter) => {
    const options = {
      where: filter,
      include: [
        {
          model: db.Genre,
          as: "Genre",
          attributes: ["id", "genreName"],
          paranoid: false,
        },
      ],
    };

    try {
      const result = await db.Book.findOne(options);
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

  async getAllBooks(options = {}, page = 1, pageSize = 10) {
    const filter = options.where || {};

    const defaultInclude = [
      {
        model: db.Genre,
        as: "Genre",
        attributes: ["id", "genreName"],
        paranoid: false,
      },
    ];

    const includeOptions = options.include
      ? [...defaultInclude, ...options.include]
      : defaultInclude;

    const queryOptions = {
      where: filter,
      include: includeOptions,
      offset: (page - 1) * pageSize,
      limit: pageSize,
    };

    try {
      const results = await db.Book.findAll(queryOptions);
      const totalItems = await db.Book.count({ where: filter });

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
