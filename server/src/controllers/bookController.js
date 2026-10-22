const { Op } = require("sequelize");
const db = require("../models");
const HttpError = require("../utils/httpError");
const { removeUpload } = require("../middleware/upload");
const { getPaging, paginationInfo } = require("../utils/pagination");

const EDITABLE = ["title", "author", "isbn", "publishedYear", "genreId", "quantity"];
const genreInclude = { model: db.Genre, as: "Genre", attributes: ["id", "genreName"] };

module.exports = {
  // GET /api/book?page=1&pageSize=12&book_title=&genre_id=&available_only=true
  async list(req, res) {
    const paging = getPaging(req.query, 12);
    const where = {};

    if (req.query.genre_id) where.genreId = req.query.genre_id;
    if (req.query.available_only === "true") where.available = { [Op.gt]: 0 };
    if (req.query.book_title) {
      const term = `%${req.query.book_title.trim()}%`;
      where[Op.or] = [{ title: { [Op.like]: term } }, { author: { [Op.like]: term } }];
    }

    const { rows, count } = await db.Book.findAndCountAll({
      where,
      include: [genreInclude],
      order: [["title", "ASC"]],
      limit: paging.limit,
      offset: paging.offset,
    });

    res.json({ success: true, data: rows, pagination: paginationInfo(paging, count) });
  },

  async getOne(req, res) {
    const book = await db.Book.findByPk(req.params.id, { include: [genreInclude] });
    if (!book) throw new HttpError(404, "Book not found.");
    res.json(book);
  },

  async create(req, res) {
    const { title, author, isbn, publishedYear, genreId, quantity } = req.body;
    const book = await db.Book.create({
      title,
      author,
      isbn,
      publishedYear,
      genreId,
      quantity,
      available: quantity,
      bookImg: req.uploadedPath || null,
    });
    res.status(201).json({ message: `"${book.title}" was added to the catalog.`, data: book });
  },

  async update(req, res) {
    const book = await db.Book.findByPk(req.params.id);
    if (!book) {
      removeUpload(req.uploadedPath);
      throw new HttpError(404, "Book not found.");
    }

    // Copies that are out with readers right now.
    const onLoan = book.quantity - book.available;

    if (req.body.quantity !== undefined) {
      if (req.body.quantity < onLoan) {
        removeUpload(req.uploadedPath);
        throw new HttpError(
          400,
          `${onLoan} ${onLoan === 1 ? "copy is" : "copies are"} on loan, so quantity can't go below ${onLoan}.`
        );
      }
      book.available = req.body.quantity - onLoan;
    }

    for (const field of EDITABLE) {
      if (req.body[field] !== undefined) book[field] = req.body[field];
    }

    let oldImage = null;
    if (req.uploadedPath) {
      oldImage = book.bookImg;
      book.bookImg = req.uploadedPath;
    } else if (req.body.removeImage === "true") {
      oldImage = book.bookImg;
      book.bookImg = null;
    }

    await book.save();
    removeUpload(oldImage);
    await book.reload({ include: [genreInclude] });

    res.json({ message: "Book updated.", data: book });
  },

  // GET /api/book/records?page=1&status=Pending&book_title=
  // Admins see everyone's records, readers only their own.
  async records(req, res) {
    const paging = getPaging(req.query, 10);
    const where = {};

    if (req.user.roles !== "admin") where.userId = req.user.id;
    if (req.query.book_title) where["$Book.title$"] = { [Op.like]: `%${req.query.book_title.trim()}%` };
    if (req.query.genre_id) where["$Book.genreId$"] = req.query.genre_id;
    if (req.query.status === "Overdue") {
      where.bookStatus = { [Op.in]: ["Borrowed", "Return Pending"] };
      where.dueDate = { [Op.lt]: new Date() };
    } else if (req.query.status) {
      // Accepts one status or several separated by commas: ?status=Pending,Return Pending
      where.bookStatus = { [Op.in]: String(req.query.status).split(",") };
    }

    const { rows, count } = await db.BorrowingRecord.findAndCountAll({
      where,
      include: [
        { model: db.User, as: "User", attributes: ["id", "username", "fullName"] },
        {
          model: db.Book,
          as: "Book",
          attributes: ["id", "title", "author", "bookImg", "genreId"],
          include: [genreInclude],
        },
      ],
      order: [["updatedAt", "DESC"]],
      limit: paging.limit,
      offset: paging.offset,
    });

    res.json({
      message: "Book records retrieved successfully",
      data: rows,
      pagination: paginationInfo(paging, count),
    });
  },
};
