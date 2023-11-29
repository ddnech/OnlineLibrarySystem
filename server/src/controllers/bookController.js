const db = require("../models");
const {
  createBookImageDBPath,
  extractFilenameFromDBPath,
  getAbsoluteBookImagePath,
} = require("../utils/filePathMulter");
const { getAllBooks, getOneBook } = require("../service/book");

module.exports = {
  async registerBook(req, res) {
    const { title, author, isbn, publishedYear, genreId, quantity } = req.body;

    const t = await db.sequelize.transaction();

    try {
      if (!req.file?.filename) {
        return res.status(400).send({
          message: "Image is required",
        });
      }

      const bookImg = createBookImageDBPath(req.file?.filename);

      const newBook = await db.Book.create(
        {
          title,
          bookImg,
          author,
          isbn,
          publishedYear,
          genreId,
          quantity,
          avalaible: quantity,
        },
        { transaction: t }
      );

      await t.commit();

      return res.status(201).json({
        message: "Book register successfully",
        data: newBook,
      });
    } catch (error) {
      await t.rollback();
      res.status(500).json({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },

  async updateBookDetails(req, res) {
    const { id } = req.params;
    const editableFields = ["title", "author", "isbn", "publishedYear", "genreId", "quantity"];
    const t = await db.sequelize.transaction();
  
    try {
      const book = await db.Book.findByPk(id, { transaction: t });
  
      if (!book) {
        await t.rollback();
        return res.status(404).json({ message: "Book not found!" });
      }
  
      if (req.body.quantity !== undefined) {
        const newQuantity = req.body.quantity;
        if (newQuantity < book.avalaible) {
          await t.rollback();
          return res.status(400).json({ message: "Cannot update quantity below the number of available books" });
        }
      }
  
      editableFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          book[field] = req.body[field];
        }
      });
  
      await book.save({ transaction: t });
      await t.commit();
  
      return res.status(200).send({
        message: "Book updated successfully",
        data: book,
      });
    } catch (error) {
      if (!t.finished) {
        await t.rollback();
      }
      console.error("Error:", error);
      res.status(500).json({ message: "Fatal error on server", errors: error.message });
    }
  },

  async getBooksList(req, res) {
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;
    const genreId = req.query.genre_id;
    const bookTitle = req.query.book_title;

    const options = {
      where: {},
    };

    if (genreId) {
      options.where.genreId = genreId;
    }

    if (bookTitle) {
      options.where.title = {
        [db.Sequelize.Op.like]: `%${bookTitle}%`,
      };
    }

    try {
      const result = await getAllBooks(options, page, pageSize);
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json({
          message: "Error fetching Books.",
          errors: result.error,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Fatal error on server.",
        errors: error.message,
      });
    }
  },

  async getSingleBook(req, res) {
    try {
      let filter = {};
      if (req.params.id) {
        filter.id = req.params.id;
      } else if (req.query.name) {
        filter.name = req.query.name;
      } else {
        return res.status(400).json({
          message: "Provide either book name or ID.",
        });
      }

      const result = await getOneBook(filter);
      if (result.success) {
        return res.status(200).json(result.data);
      } else {
        return res.status(500).json({message: result.error });
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({message: "Internal Server Error" });
    }
  },
};
