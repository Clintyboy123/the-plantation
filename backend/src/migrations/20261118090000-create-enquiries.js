'use strict';

// One table for every enquiry on the site. "type" says which audience it came from;
// the fields only some audiences need (company, suite, event type ...) live in "details".
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('enquiries', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      type: {
        type: Sequelize.ENUM('wedding', 'corporate', 'accommodation', 'boma', 'church', 'general'),
        allowNull: false,
      },
      name: { type: Sequelize.STRING(120), allowNull: false },
      email: { type: Sequelize.STRING(254), allowNull: false },
      phone: { type: Sequelize.STRING(40), allowNull: false },
      start_date: { type: Sequelize.DATEONLY, allowNull: true },
      end_date: { type: Sequelize.DATEONLY, allowNull: true },
      guests: { type: Sequelize.SMALLINT.UNSIGNED, allowNull: true },
      details: { type: Sequelize.JSON, allowNull: true },
      message: { type: Sequelize.TEXT, allowNull: true },
      source_page: { type: Sequelize.STRING(120), allowNull: true },
      status: { type: Sequelize.ENUM('new', 'contacted', 'closed'), allowNull: false, defaultValue: 'new' },
      emailed_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex('enquiries', ['type', 'created_at']);
    await queryInterface.addIndex('enquiries', ['status']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('enquiries');
  },
};
