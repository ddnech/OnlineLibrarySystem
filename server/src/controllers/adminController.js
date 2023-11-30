const db = require("../models");

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
    const  recordId  = req.params.id;
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
      const notes = isOverdue
        ? `Returned overdue`
        : `Returned on time`;
  
        await returnRecord.update({ bookStatus: "Returned", returnDate: new Date() }, { transaction: t });
  
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
  
};
