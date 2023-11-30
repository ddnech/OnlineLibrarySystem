const db = require("../models");

module.exports = {
  getOneBookRecord: async (filter) => {
    const options = {
      where: filter,
      include: [
        {
          model: db.User,
          as: "User",
          attributes: ["id", "username"],
        },
        {
          model: db.Book,
          as: "Book",
          attributes: ["id", "title"],
          include: [
            {
              model: db.Genre,
              as: "Genre",
              attributes: ["id", "genreName"],
            },
          ],
        },
      ],
    };

    try {
      const result = await db.BorrowingRecord.findOne(options);
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

  async getAllBookRecords({ bookTitle, genreId, userId } = {}, page = 1, pageSize = 10) {
    const filter = {};
    if (bookTitle) {
      filter['$Book.title$'] = { [db.Sequelize.Op.like]: `%${bookTitle}%` };
    }
    if (genreId) {
      filter['$Book.Genre.id$'] = genreId;
    }
    if (userId !== null) {
      filter.userId = userId;
    }
  
    const includeOptions = [
      {
        model: db.User,
        as: "User",
        attributes: ["id", "username"],
      },
      {
        model: db.Book,
        as: "Book",
        attributes: ["id", "title"],
        include: [{
          model: db.Genre,
          as: "Genre",
          attributes: ["id", "genreName"],
        }],
      },
    ];
  
    const queryOptions = {
      where: filter,
      include: includeOptions,
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * pageSize,
      limit: pageSize,
    };
  
    try {
      const results = await db.BorrowingRecord.findAll(queryOptions);
      const totalItems = await db.BorrowingRecord.count({ where: filter, include: includeOptions });
  
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
  }
  
};
