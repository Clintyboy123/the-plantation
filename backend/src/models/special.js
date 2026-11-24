module.exports = (sequelize, DataTypes) => {
  const Special = sequelize.define(
    'Special',
    {
      kicker: { type: DataTypes.STRING(40), allowNull: false },
      name: { type: DataTypes.STRING(120), allowNull: false, unique: true },
      body: { type: DataTypes.TEXT, allowNull: false },
      note: { type: DataTypes.STRING(200), allowNull: true },
      photo: { type: DataTypes.STRING(80), allowNull: false },
      sortOrder: { type: DataTypes.SMALLINT.UNSIGNED, allowNull: false, defaultValue: 0 },
      isPublished: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      availableUntil: { type: DataTypes.DATEONLY, allowNull: true },
    },
    { tableName: 'specials' }
  );
  return Special;
};
