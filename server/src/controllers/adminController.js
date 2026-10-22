const { Op } = require("sequelize");
const db = require("../models");
const HttpError = require("../utils/httpError");
const { loanDays } = require("../config/env");
const { getPaging, paginationInfo } = require("../utils/pagination");

const DAY = 24 * 60 * 60 * 1000;

module.exports = {
  async approveBorrow(req, res) {
    const record = await db.sequelize.transaction(async (t) => {
      const record = await db.BorrowingRecord.findByPk(req.params.id, { transaction: t, lock: t.LOCK.UPDATE });
      if (!record || record.bookStatus !== "Pending") {
        throw new HttpError(404, "This request doesn't exist or was already handled.");
      }

      const book = await db.Book.findByPk(record.bookId, { transaction: t, lock: t.LOCK.UPDATE });
      if (!book || book.available < 1) {
        throw new HttpError(409, "No copies are left on the shelf. Reject the request or wait for a return.");
      }

      const now = new Date();
      await book.decrement("available", { by: 1, transaction: t });
      await record.update(
        { bookStatus: "Borrowed", borrowDate: now, dueDate: new Date(now.getTime() + loanDays * DAY) },
        { transaction: t }
      );
      await db.AdminAction.create(
        { recordId: record.id, actionDate: now, action: "Approve", notes: "Approved by Admin" },
        { transaction: t }
      );
      return record;
    });

    res.json({ message: "Request approved.", data: record });
  },

  async rejectBorrow(req, res) {
    const reason = (req.body?.reason || "").trim().slice(0, 200);

    await db.sequelize.transaction(async (t) => {
      const record = await db.BorrowingRecord.findByPk(req.params.id, { transaction: t, lock: t.LOCK.UPDATE });
      if (!record || record.bookStatus !== "Pending") {
        throw new HttpError(404, "This request doesn't exist or was already handled.");
      }
      await record.update({ bookStatus: "Rejected" }, { transaction: t });
      await db.AdminAction.create(
        { recordId: record.id, actionDate: new Date(), action: "Reject", notes: reason || "Rejected by Admin" },
        { transaction: t }
      );
    });

    res.json({ message: "Request rejected." });
  },

  // Works for "Return Pending" and also "Borrowed", for when a reader hands the
  // book over at the desk without pressing the return button first.
  async approveReturn(req, res) {
    const notes = await db.sequelize.transaction(async (t) => {
      const record = await db.BorrowingRecord.findByPk(req.params.id, { transaction: t, lock: t.LOCK.UPDATE });
      if (!record || !["Return Pending", "Borrowed"].includes(record.bookStatus)) {
        throw new HttpError(404, "This loan doesn't exist or was already returned.");
      }

      const now = new Date();
      const late = record.dueDate && record.dueDate < now;
      const notes = late ? "Returned overdue" : "Returned on time";

      const book = await db.Book.findByPk(record.bookId, { transaction: t, lock: t.LOCK.UPDATE });
      if (book && book.available < book.quantity) {
        await book.increment("available", { by: 1, transaction: t });
      }

      await record.update({ bookStatus: "Returned", returnDate: now, overdue: Boolean(late) }, { transaction: t });
      await db.AdminAction.create(
        { recordId: record.id, actionDate: now, action: "Verify Returned", notes },
        { transaction: t }
      );
      return notes;
    });

    res.json({ message: `Return confirmed (${notes.toLowerCase()}).` });
  },

  // GET /api/admins/admin-action?page=1&action=Approve&book_title=
  async actions(req, res) {
    const paging = getPaging(req.query, 15);
    const where = {};
    if (req.query.action) where.action = req.query.action;

    const bookWhere = req.query.book_title
      ? { title: { [Op.like]: `%${req.query.book_title.trim()}%` } }
      : undefined;

    const { rows, count } = await db.AdminAction.findAndCountAll({
      where,
      include: [
        {
          model: db.BorrowingRecord,
          as: "BorrowingRecord",
          attributes: ["id", "userId", "bookId"],
          required: Boolean(bookWhere),
          include: [
            { model: db.User, as: "User", attributes: ["id", "username", "fullName"] },
            { model: db.Book, as: "Book", attributes: ["id", "title"], where: bookWhere, required: Boolean(bookWhere) },
          ],
        },
      ],
      order: [["actionDate", "DESC"]],
      limit: paging.limit,
      offset: paging.offset,
    });

    res.json({
      message: "Admin Actions list retrieved successfully",
      data: rows,
      pagination: paginationInfo(paging, count),
    });
  },

  // Numbers for the top of the admin pages.
  async stats(req, res) {
    const now = new Date();
    const [titles, copies, onShelf, pending, returns, overdue] = await Promise.all([
      db.Book.count(),
      db.Book.sum("quantity"),
      db.Book.sum("available"),
      db.BorrowingRecord.count({ where: { bookStatus: "Pending" } }),
      db.BorrowingRecord.count({ where: { bookStatus: "Return Pending" } }),
      db.BorrowingRecord.count({
        where: { bookStatus: { [Op.in]: ["Borrowed", "Return Pending"] }, dueDate: { [Op.lt]: now } },
      }),
    ]);

    res.json({
      data: {
        titles,
        copies: copies || 0,
        onLoan: (copies || 0) - (onShelf || 0),
        pending,
        returns,
        overdue,
      },
    });
  },
};
