const db = require("../models");

module.exports = {
  getOneAdminAction: async (filter) => {
    const options = {
        where: filter,
        include: [
          {
            model: db.BorrowingRecord,
            as: "BorrowingRecord",
            attributes: ["id", "userId", "bookId"],
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
              }
            ]
          },
        ],
      };
      

    try {
      const result = await db.AdminAction.findOne(options);
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

  async getAllAdminAction({ bookTitle,action } = {}, page = 1, pageSize = 10) {
    const filter = {};
    if (action) {
      filter.action = action;
    }
  
    const includeOptions = [
      {
        model: db.BorrowingRecord,
        as: "BorrowingRecord",
        attributes: ["id", "userId", "bookId"],
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
            where: bookTitle ? { title: { [db.Sequelize.Op.like]: `%${bookTitle}%` } } : {},
          }
        ]
      },
    ];
  
    const queryOptions = {
      where: filter,
      include: includeOptions,
      offset: (page - 1) * pageSize,
      limit: pageSize,
    };
  
    try {
      const results = await db.AdminAction.findAll(queryOptions);
      const totalItems = await db.AdminAction.count({ 
        where: filter,
      });
  
      return {
        success: true,
        data: results,
        pagination: {
          page,
          pageSize,
          totalItems,
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