module.exports = (sequelize, DataTypes) => {
  const Enquiry = sequelize.define(
    'Enquiry',
    {
      type: {
        type: DataTypes.ENUM('wedding', 'corporate', 'accommodation', 'boma', 'church', 'general'),
        allowNull: false,
      },
      name: { type: DataTypes.STRING(120), allowNull: false },
      email: { type: DataTypes.STRING(254), allowNull: false },
      phone: { type: DataTypes.STRING(40), allowNull: false },
      startDate: { type: DataTypes.DATEONLY, allowNull: true },
      endDate: { type: DataTypes.DATEONLY, allowNull: true },
      guests: { type: DataTypes.SMALLINT.UNSIGNED, allowNull: true },
      details: { type: DataTypes.JSON, allowNull: true },
      message: { type: DataTypes.TEXT, allowNull: true },
      sourcePage: { type: DataTypes.STRING(120), allowNull: true },
      status: { type: DataTypes.ENUM('new', 'contacted', 'closed'), allowNull: false, defaultValue: 'new' },
      emailedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: 'enquiries' }
  );
  return Enquiry;
};
