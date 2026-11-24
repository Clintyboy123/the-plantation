'use strict';

// Creates the venue's admin login from ADMIN_EMAIL and ADMIN_PASSWORD in .env.
// Safe to run again: if that email already exists, its password is reset to ADMIN_PASSWORD.
// Run on the server with:  docker compose exec backend npx sequelize-cli db:seed --seed 20261124090000-admin.js
const bcrypt = require('bcryptjs');
const env = require('../config/env');

module.exports = {
  async up(queryInterface) {
    const { email, password } = env.admin;
    if (!email || !password) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env first.');
    if (password.length < 12) throw new Error('ADMIN_PASSWORD must be at least 12 characters.');

    const passwordHash = await bcrypt.hash(password, 12);
    const now = new Date();
    const [existing] = await queryInterface.sequelize.query('SELECT id FROM admins WHERE email = ?', {
      replacements: [email],
      type: queryInterface.sequelize.QueryTypes.SELECT,
    });

    if (existing) {
      await queryInterface.bulkUpdate('admins', { password_hash: passwordHash, updated_at: now }, { id: existing.id });
      console.log(`Admin ${email}: password reset.`);
    } else {
      await queryInterface.bulkInsert('admins', [{ email, password_hash: passwordHash, created_at: now, updated_at: now }]);
      console.log(`Admin ${email}: created.`);
    }
  },

  async down(queryInterface) {
    if (env.admin.email) await queryInterface.bulkDelete('admins', { email: env.admin.email });
  },
};
