const { Op } = require('sequelize');
const { Special, sequelize } = require('../models');
const ApiError = require('../utils/ApiError');
const today = require('../utils/today');

const ORDER = [['sortOrder', 'ASC'], ['id', 'ASC']];
const EDITABLE = ['kicker', 'name', 'body', 'note', 'photo', 'isPublished', 'availableUntil'];

const pick = (values) =>
  Object.fromEntries(
    EDITABLE.filter((key) => values[key] !== undefined).map((key) => [key, values[key] === '' ? null : values[key]])
  );

// What visitors see: switched on, and not past its "show until" date.
exports.listLive = () =>
  Special.findAll({
    where: {
      isPublished: true,
      [Op.or]: [{ availableUntil: null }, { availableUntil: { [Op.gte]: today() } }],
    },
    attributes: ['id', 'kicker', 'name', 'body', 'note', 'photo'],
    order: ORDER,
  });

// Every special, for the admin screen (capped well above anything a venue would run at once).
exports.listAll = () => Special.findAll({ order: ORDER, limit: 100 });

const find = async (id) => {
  const special = await Special.findByPk(id);
  if (!special) throw new ApiError(404, 'That special no longer exists. Refresh the page.');
  return special;
};

const nameTaken = (error) => {
  if (error.name === 'SequelizeUniqueConstraintError') {
    throw new ApiError(409, 'Please check the highlighted fields.', [{ field: 'name', message: 'Another special already has this name' }]);
  }
  throw error;
};

exports.create = async (values) => {
  const last = (await Special.max('sortOrder')) || 0;
  return Special.create({ ...pick(values), sortOrder: last + 1 }).catch(nameTaken);
};

exports.update = async (id, values) => {
  const special = await find(id);
  return special.update(pick(values)).catch(nameTaken);
};

exports.remove = async (id) => {
  const special = await find(id);
  await special.destroy();
};

// ids in the order the admin wants them shown. Every special must be listed exactly once.
exports.reorder = async (ids) => {
  const all = await Special.findAll({ attributes: ['id'] });
  const known = new Set(all.map((s) => s.id));
  if (ids.length !== known.size || new Set(ids).size !== ids.length || !ids.every((id) => known.has(id))) {
    throw new ApiError(409, 'The list changed while you were editing. Refresh the page and try again.');
  }
  await sequelize.transaction(async (transaction) => {
    for (const [index, id] of ids.entries()) {
      await Special.update({ sortOrder: index + 1 }, { where: { id }, transaction });
    }
  });
  return exports.listAll();
};

// Names a couple may pick in the wedding enquiry form: every special, plus the two open answers.
exports.packageChoices = async () => {
  const specials = await Special.findAll({ attributes: ['name'] });
  return [...specials.map((s) => s.name), 'A custom package', 'Not sure yet'];
};
