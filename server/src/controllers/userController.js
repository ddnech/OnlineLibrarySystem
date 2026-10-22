const { Op } = require("sequelize");
const db = require("../models");
const HttpError = require("../utils/httpError");

// A reader can only have one book "in progress" at a time.
const ACTIVE_STATUSES = ["Pending", "Borrowed", "Return Pending"];

module.exports = {
  async profile(req, res) {
    const user = await db.User.findByPk(req.user.id, {
      attributes: ["id", "username", "email", "address", "fullName", "roles", "createdAt"],
    });
    if (!user) throw new HttpError(404, "User not found.");

    const currentLoan = await db.BorrowingRecord.findOne({
      where: { userId: user.id, bookStatus: { [Op.in]: ACTIVE_STATUSES } },
      include: [{ model: db.Book, as: "Book", attributes: ["id", "title", "author", "bookImg"] }],
      order: [["createdAt", "DESC"]],
    });

    const [totalBorrowed, returnedLate] = await Promise.all([
      db.BorrowingRecord.count({
        where: { userId: user.id, bookStatus: { [Op.in]: ["Borrowed", "Return Pending", "Returned"] } },
      }),
      db.BorrowingRecord.count({ where: { userId: user.id, bookStatus: "Returned", overdue: true } }),
    ]);

    res.json({
      message: "User profile retrieved successfully.",
      data: { ...user.toJSON(), currentLoan, stats: { totalBorrowed, returnedLate } },
    });
  },

  // POST /api/users/:book_id  -> ask to borrow a book
  async requestBook(req, res) {
    const userId = req.user.id;

    const active = await db.BorrowingRecord.findOne({
      where: { userId, bookStatus: { [Op.in]: ACTIVE_STATUSES } },
      include: [{ model: db.Book, as: "Book", attributes: ["title"] }],
    });
    if (active) {
      throw new HttpError(
        400,
        `You already have "${active.Book?.title}" (${active.bookStatus.toLowerCase()}). Return it before borrowing another book.`
      );
    }

    const book = await db.Book.findByPk(req.params.book_id);
    if (!book) throw new HttpError(404, "Book not found.");
    if (book.available < 1) throw new HttpError(409, `All copies of "${book.title}" are out right now.`);

    // Borrow and due dates are set when an admin approves the request.
    const record = await db.BorrowingRecord.create({
      userId,
      bookId: book.id,
      bookStatus: "Pending",
      overdue: false,
    });

    res.status(201).json({
      message: `Request sent for "${book.title}". You can pick it up once an admin approves it.`,
      data: record,
    });
  },

  // DELETE /api/users/requests/:id  -> cancel a request that hasn't been approved yet
  async cancelRequest(req, res) {
    const record = await db.BorrowingRecord.findByPk(req.params.id);
    if (!record || record.userId !== req.user.id) throw new HttpError(404, "Request not found.");
    if (record.bookStatus !== "Pending") throw new HttpError(400, "Only pending requests can be cancelled.");

    await record.destroy();
    res.json({ message: "Request cancelled." });
  },

  // PATCH /api/users/pending-return/:id  -> tell the library you're returning a book
  async returnBook(req, res) {
    const record = await db.BorrowingRecord.findByPk(req.params.id);
    if (!record || record.userId !== req.user.id) throw new HttpError(404, "Loan not found.");
    if (record.bookStatus !== "Borrowed") throw new HttpError(400, "This book isn't currently borrowed.");

    await record.update({ bookStatus: "Return Pending" });
    res.json({ message: "Return noted. An admin will confirm once they have the book.", data: record });
  },
};
