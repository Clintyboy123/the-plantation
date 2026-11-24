'use strict';

// Wedding specials and packages, edited by the venue in /admin and shown on the Weddings page.
// available_until: the last day a special is shown; after it the special hides itself.
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('specials', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      kicker: { type: Sequelize.STRING(40), allowNull: false },
      name: { type: Sequelize.STRING(120), allowNull: false, unique: true },
      body: { type: Sequelize.TEXT, allowNull: false },
      note: { type: Sequelize.STRING(200), allowNull: true },
      photo: { type: Sequelize.STRING(80), allowNull: false },
      sort_order: { type: Sequelize.SMALLINT.UNSIGNED, allowNull: false, defaultValue: 0 },
      is_published: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      available_until: { type: Sequelize.DATEONLY, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex('specials', ['is_published', 'sort_order']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('specials');
  },
};
