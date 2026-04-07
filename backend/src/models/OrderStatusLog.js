const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ORDER_STATUSES = [
  'pending',
  'paid',
  'awaiting_recipient',
  'recipient_accepted',
  'processing',
  'out_for_delivery',
  'delivered',
  'cancelled',
];

const OrderStatusLog = sequelize.define(
  'OrderStatusLog',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fromStatus: {
      type: DataTypes.ENUM(...ORDER_STATUSES),
      allowNull: true,
    },
    toStatus: {
      type: DataTypes.ENUM(...ORDER_STATUSES),
      allowNull: false,
    },
    source: {
      type: DataTypes.ENUM('system', 'admin', 'payment', 'recipient'),
      allowNull: false,
      defaultValue: 'system',
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'order_status_logs',
    timestamps: true,
  },
);

module.exports = OrderStatusLog;
