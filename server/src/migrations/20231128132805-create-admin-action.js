'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AdminActions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      recordId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "BorrowingRecords",
          key: "id",
        },
      },
      actionDate: {
        type: Sequelize.DATE
      },
      action: {
        allowNull: false,
        type: Sequelize.ENUM('Approve','Verify Returned'),
      },   
      notes: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('AdminActions');
  }
};