"use strict";

/**
 * 2026 update:
 *  - fix the "avalaible" typo on Books
 *  - book covers are optional now (the UI draws a cover when there is no image)
 *  - admins can reject a borrow request, so add "Rejected" / "Reject"
 *
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn("Books", "avalaible", "available");

    await queryInterface.changeColumn("Books", "bookImg", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn("BorrowingRecords", "bookStatus", {
      type: Sequelize.ENUM("Pending", "Borrowed", "Return Pending", "Returned", "Rejected"),
      allowNull: false,
    });

    await queryInterface.changeColumn("BorrowingRecords", "overdue", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.changeColumn("AdminActions", "action", {
      type: Sequelize.ENUM("Approve", "Verify Returned", "Reject"),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("AdminActions", "action", {
      type: Sequelize.ENUM("Approve", "Verify Returned"),
      allowNull: false,
    });
    await queryInterface.changeColumn("BorrowingRecords", "bookStatus", {
      type: Sequelize.ENUM("Pending", "Borrowed", "Return Pending", "Returned"),
      allowNull: false,
    });
    await queryInterface.changeColumn("Books", "bookImg", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.renameColumn("Books", "available", "avalaible");
  },
};
