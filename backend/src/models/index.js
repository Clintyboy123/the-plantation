// Loads every model file in this folder and wires up their relationships.
// A model file exports: (sequelize, DataTypes) => Model, with an optional Model.associate(models).
const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const env = require('../config/env');
const config = require('../config/database');

const settings = config[env.nodeEnv] || config.production;
const sequelize = new Sequelize(settings.database, settings.username, settings.password, settings);

const db = {};

fs.readdirSync(__dirname)
  .filter((file) => file !== 'index.js' && file.endsWith('.js'))
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.values(db).forEach((model) => {
  if (typeof model.associate === 'function') model.associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
