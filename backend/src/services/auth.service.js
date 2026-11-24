const bcrypt = require('bcryptjs');
const { Admin } = require('../models');

// Compared against when the email is unknown, so a wrong email takes as long as a wrong password
// and response times don't reveal which accounts exist.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12);

exports.signIn = async (email, password) => {
  const admin = await Admin.scope('withPassword').findOne({ where: { email } });
  const ok = await bcrypt.compare(password, admin ? admin.passwordHash : DUMMY_HASH);
  if (!admin || !ok) return null;
  await admin.update({ lastLoginAt: new Date() });
  return Admin.findByPk(admin.id);
};

exports.publicAdmin = (admin) => ({ id: admin.id, email: admin.email, name: admin.name });
