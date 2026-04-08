const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SUBSCRIPTION_STATUS = ['active', 'paused', 'cancelled'];
const SUBSCRIPTION_FREQUENCY = ['weekly', 'biweekly', 'monthly'];

const Subscription = sequelize.define(
  'Subscription',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...SUBSCRIPTION_STATUS),
      allowNull: false,
      defaultValue: 'active',
    },
    frequency: {
      type: DataTypes.ENUM(...SUBSCRIPTION_FREQUENCY),
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    nextDeliveryDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    lastDeliveryDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    deliveryAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'subscriptions',
    timestamps: true,
  },
);

module.exports = Subscription;
