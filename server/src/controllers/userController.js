const db = require("../models");

module.exports = {
  async bookRequest(req, res) {
    const bookId = req.params.book_id;
    const userId = req.user.id;
    const t = await db.sequelize.transaction();
    try {

      const latestBorrow = await db.BorrowingRecord.findOne({
        where: { userId },
        order: [['createdAt', 'DESC']]
      });

      if (latestBorrow && latestBorrow.bookStatus !== 'Returned') {
        return res.status(400).json({ message: "User already has a borrowed book." });
      }

      const book = await db.Book.findOne({
        where: { id: bookId, avalaible: { [db.Sequelize.Op.gt]: 0 } }
      });
      if (!book) {
        return res.status(404).json({ message: "Book is not available for borrowing." });
      }

      const borrowDate = new Date();
      const dueDate = new Date(borrowDate.getTime() + 14 * 24 * 60 * 60 * 1000);

      const borrowingRecord = await db.BorrowingRecord.create({
        userId,
        bookId,
        borrowDate,
        dueDate,
        bookStatus: "Pending",
        overdue: false
      }, { transaction: t });

      await t.commit();
      return res.status(201).json({
        message: "Book borrowing request successful.",
        data: borrowingRecord
      });
    } catch (error) {
      await t.rollback();
      return res.status(500).json({
        message: "Fatal error on server",
        error: error.message
      });
    }
  },

  async bookReturn(req, res) {
    const recordId = req.params.id;
    const userId = req.user.id; 
    const t = await db.sequelize.transaction();
  
    try {
      const activeBorrow = await db.BorrowingRecord.findByPk(recordId);
  
      if (!activeBorrow || activeBorrow.bookStatus === 'Returned' || activeBorrow.userId !== userId) {
        return res.status(404).json({ message: "Borrowing record not found, already returned, or not borrowed by this user." });
      }
  
      await activeBorrow.update({ 
        bookStatus: 'Return Pending' 
      }, { transaction: t });
  
      await t.commit();
      return res.status(200).json({
        message: "Book return marked as pending",
        data: activeBorrow
      });
    } catch (error) {
      await t.rollback();
      return res.status(500).json({
        message: "Internal server error",
        error: error.message
      });
    }
  }
};
