const schedule = require("node-schedule");
const { Op } = require("sequelize");
const db = require("../models");

/** Flags every loan that is past its due date and still not returned. */
async function markOverdueLoans() {
  try {
    const [count] = await db.BorrowingRecord.update(
      { overdue: true },
      {
        where: {
          bookStatus: { [Op.in]: ["Borrowed", "Return Pending"] },
          dueDate: { [Op.lt]: new Date() },
          overdue: false,
        },
      }
    );
    if (count) console.log(`[overdue] Marked ${count} loan(s) as overdue.`);
  } catch (error) {
    console.error("[overdue] Check failed:", error.message);
  }
}

function startOverdueJob() {
  markOverdueLoans();
  // Every hour, on the hour.
  return schedule.scheduleJob("0 * * * *", markOverdueLoans);
}

module.exports = { startOverdueJob, markOverdueLoans };
