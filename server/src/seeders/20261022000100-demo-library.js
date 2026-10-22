"use strict";

const bcrypt = require("bcryptjs");
const { QueryTypes } = require("sequelize");

// Some books and loans so the app has something to show on first run.
// All titles are public domain classics. Covers are drawn by the UI.
const BOOKS = [
  ["Pride and Prejudice", "Jane Austen", "9780141439518", 1813, "Fiction", 4],
  ["Frankenstein", "Mary Shelley", "9780141439471", 1818, "Fiction", 3],
  ["Great Expectations", "Charles Dickens", "9780141439563", 1861, "Fiction", 2],
  ["Moby-Dick", "Herman Melville", "9780142437247", 1851, "Fiction", 1],
  ["The Hound of the Baskervilles", "Arthur Conan Doyle", "9780140437867", 1902, "Mystery", 3],
  ["The Moonstone", "Wilkie Collins", "9780140434088", 1868, "Mystery", 2],
  ["Alice's Adventures in Wonderland", "Lewis Carroll", "9780141439761", 1865, "Fantasy", 3],
  ["The Wonderful Wizard of Oz", "L. Frank Baum", "9780143106296", 1900, "Fantasy", 2],
  ["On the Origin of Species", "Charles Darwin", "9780451529060", 1859, "Science", 2],
  ["Relativity: The Special and General Theory", "Albert Einstein", "9780486417141", 1916, "Science", 1],
  ["The Decline and Fall of the Roman Empire", "Edward Gibbon", "9780140437645", 1776, "History", 1],
  ["The Wealth of Nations", "Adam Smith", "9780140432084", 1776, "Non-Fiction", 2],
  ["Walden", "Henry David Thoreau", "9780143106357", 1854, "Non-Fiction", 2],
];

const DAY = 24 * 60 * 60 * 1000;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    if (process.env.SEED_DEMO_DATA === "false") {
      console.log("SEED_DEMO_DATA=false, skipping demo books and loans.");
      return;
    }

    const now = new Date();
    const select = (sql) => queryInterface.sequelize.query(sql, { type: QueryTypes.SELECT });

    const genres = await select("SELECT id, genreName FROM Genres");
    const genreId = (name) => genres.find((g) => g.genreName === name)?.id ?? genres[0].id;

    await queryInterface.bulkInsert(
      "Books",
      BOOKS.map(([title, author, isbn, publishedYear, genre, quantity]) => ({
        title,
        author,
        isbn,
        publishedYear,
        genreId: genreId(genre),
        quantity,
        available: quantity,
        bookImg: null,
        createdAt: now,
        updatedAt: now,
      }))
    );

    // Two extra readers who already have some history.
    const password = await bcrypt.hash("Password12", 10);
    await queryInterface.bulkInsert("Users", [
      {
        username: "rina",
        roles: "user",
        email: "rina@gmail.com",
        address: "Jl. Sambas, Jakarta",
        password,
        fullName: "Rina Wijaya",
        createdAt: now,
        updatedAt: now,
      },
      {
        username: "budi",
        roles: "user",
        email: "budi@gmail.com",
        address: "BSD City, Tangerang",
        password,
        fullName: "Budi Santoso",
        createdAt: now,
        updatedAt: now,
      },
    ]);

    const users = await select("SELECT id, username FROM Users");
    const books = await select("SELECT id, title FROM Books");
    const userId = (name) => users.find((u) => u.username === name).id;
    const bookId = (title) => books.find((b) => b.title === title).id;

    // rina: returned one book last month, and is now late with another one.
    // budi: just asked to borrow a book, waiting for the admin.
    const records = [
      {
        userId: userId("rina"),
        bookId: bookId("The Moonstone"),
        borrowDate: new Date(now - 40 * DAY),
        dueDate: new Date(now - 26 * DAY),
        returnDate: new Date(now - 28 * DAY),
        bookStatus: "Returned",
        overdue: false,
      },
      {
        userId: userId("rina"),
        bookId: bookId("Moby-Dick"),
        borrowDate: new Date(now - 20 * DAY),
        dueDate: new Date(now - 6 * DAY),
        returnDate: null,
        bookStatus: "Borrowed",
        overdue: true,
      },
      {
        userId: userId("budi"),
        bookId: bookId("Frankenstein"),
        borrowDate: null,
        dueDate: null,
        returnDate: null,
        bookStatus: "Pending",
        overdue: false,
      },
    ].map((r) => ({ ...r, createdAt: r.borrowDate || now, updatedAt: now }));

    await queryInterface.bulkInsert("BorrowingRecords", records);

    // Moby-Dick only has one copy and rina has it.
    await queryInterface.bulkUpdate("Books", { available: 0 }, { title: "Moby-Dick" });

    const saved = await select("SELECT id, bookStatus, returnDate, borrowDate FROM BorrowingRecords");
    const actions = [];
    for (const r of saved) {
      if (r.bookStatus === "Pending") continue;
      actions.push({
        recordId: r.id,
        actionDate: new Date(r.borrowDate),
        action: "Approve",
        notes: "Approved by Admin",
        createdAt: new Date(r.borrowDate),
        updatedAt: now,
      });
      if (r.bookStatus === "Returned") {
        actions.push({
          recordId: r.id,
          actionDate: new Date(r.returnDate),
          action: "Verify Returned",
          notes: "Returned on time",
          createdAt: new Date(r.returnDate),
          updatedAt: now,
        });
      }
    }
    if (actions.length) await queryInterface.bulkInsert("AdminActions", actions);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("AdminActions", null, {});
    await queryInterface.bulkDelete("BorrowingRecords", null, {});
    await queryInterface.bulkDelete("Books", { isbn: { [Sequelize.Op.in]: BOOKS.map((b) => b[2]) } });
    await queryInterface.bulkDelete("Users", { username: { [Sequelize.Op.in]: ["rina", "budi"] } });
  },
};
