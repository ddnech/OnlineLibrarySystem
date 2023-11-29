'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BorrowingRecords', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        }
      },
      bookId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Books",
          key: "id",
        }
      },
      borrowDate: {
        allowNull:true,
        type: Sequelize.DATE
      },
      dueDate: {
        allowNull:true,
        type: Sequelize.DATE
      },
      returnDate: {
        allowNull:true,
        type: Sequelize.DATE
      },
      bookStatus: {
        allowNull: false,
        type: Sequelize.ENUM('Pending','Rejected','Borrowed','Return Pending','Returned','Overdue'),
      },
      overdue: {
        allowNull:false,
        type: Sequelize.BOOLEAN,
      }, 
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('BorrowingRecords');
  }
};