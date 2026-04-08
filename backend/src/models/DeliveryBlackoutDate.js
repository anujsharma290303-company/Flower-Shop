const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DeliveryBlackoutDate = sequelize.define(
  'DeliveryBlackoutDate',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: true,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: 'delivery_blackout_dates',
    timestamps: true,
  },
);

module.exports = DeliveryBlackoutDate;
