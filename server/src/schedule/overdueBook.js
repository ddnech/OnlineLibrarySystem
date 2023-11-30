const schedule = require("node-schedule");
const db = require("../models");

const checkOverdueBooks = async () => {

  try {
    const today = new Date();

    const borrowedRecords = await db.BorrowingRecord.findAll({
      where: {
        bookStatus: 'Borrowed',
        dueDate: {
          [db.Sequelize.Op.lt]: today
        },
        overdue: false 
      },
    });

    const t = await db.sequelize.transaction();

    for (let record of borrowedRecords) {
      if (record.dueDate < today) {
        await db.BorrowingRecord.update(
          { overdue: true },
          { where: { id: record.id } },
          { transaction: t }
        );
      }
    }

    await t.commit();
  } catch (error) {
    if (t && !t.finished) {
      await t.rollback();
      console.error("Error in checkOverdueBooks job:", error);
    }
  }
};

const job = schedule.scheduleJob("0 0 * * *", checkOverdueBooks);
