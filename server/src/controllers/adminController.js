const db = require("../models");
const {
  getAllAdminAction,
  getOneAdminAction,
} = require("../service/adminAction");

module.exports = {
  async approveBorrowRequest(req, res) {
    const recordId = req.params.id;
    const t = await db.sequelize.transaction();

    try {
      const borrowRecord = await db.BorrowingRecord.findByPk(recordId);
      if (!borrowRecord || borrowRecord.bookStatus !== "Pending") {
        return res.status(404).json({
          message: "Borrowing record not found or not in Pending status.",
        });
      }

      const book = await db.Book.findByPk(borrowRecord.bookId);
      if (book) {
        await book.decrement("avalaible", { by: 1, transaction: t });
      }

      await borrowRecord.update({ bookStatus: "Borrowed" }, { transaction: t });

      await db.AdminAction.create(
        {
          recordId,
          actionDate: new Date(),
          action: "Approve",
          notes: `Approved by Admin`,
        },
        { transaction: t }
      );

      await t.commit();
      return res
        .status(200)
        .json({ message: "Borrow request approved successfully." });
    } catch (error) {
      await t.rollback();
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  async approveReturnRequest(req, res) {
    const recordId = req.params.id;
    const t = await db.sequelize.transaction();

    try {
      const returnRecord = await db.BorrowingRecord.findByPk(recordId);
      if (!returnRecord || returnRecord.bookStatus !== "Return Pending") {
        return res.status(404).json({
          message: "Return record not found or not in Return Pending status.",
        });
      }

      const book = await db.Book.findByPk(returnRecord.bookId);
      if (book) {
        await book.increment("avalaible", { by: 1, transaction: t });
      }

      const isOverdue = returnRecord.dueDate < new Date();
      const notes = isOverdue ? `Returned overdue` : `Returned on time`;

      await returnRecord.update(
        { bookStatus: "Returned", returnDate: new Date() },
        { transaction: t }
      );

      await db.AdminAction.create(
        {
          recordId,
          actionDate: new Date(),
          action: "Verify Returned",
          notes,
        },
        { transaction: t }
      );

      await t.commit();
      return res
        .status(200)
        .json({ message: "Return request approved successfully." });
    } catch (error) {
      await t.rollback();
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  async getAdminActionsList(req, res) {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const bookTitle = req.query.book_title;
    const action = req.query.action;

    try {
      const result = await getAllAdminAction(
        { bookTitle, action },
        page,
        pageSize
      );
      if (result.success) {
        res.status(200).json({
          message: "Admin Actions list retrieved successfully",
          data: result.data,
          pagination: result.pagination,
        });
      } else {
        res.status(500).json({
          message: "Error fetching Admin Actions.",
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
};
