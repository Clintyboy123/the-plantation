const { matchedData } = require('express-validator');
const specials = require('../services/special.service');

exports.listLive = async (req, res) => {
  res.json({ success: true, data: await specials.listLive() });
};

exports.listAll = async (req, res) => {
  res.json({ success: true, data: await specials.listAll() });
};

// includeOptionals keeps a note or date sent as null/"" so it can be cleared.
exports.create = async (req, res) => {
  const special = await specials.create(matchedData(req, { locations: ['body'], includeOptionals: true }));
  res.status(201).json({ success: true, message: 'Special added.', data: special });
};

exports.update = async (req, res) => {
  const { id, ...values } = matchedData(req, { locations: ['params', 'body'], includeOptionals: true });
  const special = await specials.update(id, values);
  res.json({ success: true, message: 'Saved.', data: special });
};

exports.remove = async (req, res) => {
  await specials.remove(matchedData(req, { locations: ['params'] }).id);
  res.status(204).end();
};

exports.reorder = async (req, res) => {
  const { ids } = matchedData(req, { locations: ['body'] });
  res.json({ success: true, message: 'Order saved.', data: await specials.reorder(ids) });
};
