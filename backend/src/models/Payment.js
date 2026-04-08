const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define(
  'Payment',
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
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.ENUM('USD', 'CAD'),
      allowNull: false,
      defaultValue: 'USD',
    },
    status: {
      type: DataTypes.ENUM('pending', 'authorized', 'captured', 'voided', 'success', 'failed', 'refunded'),
      allowNull: false,
      defaultValue: 'pending',
    },
    method: {
      type: DataTypes.ENUM('mock-card', 'mock-upi', 'crypto'),
      allowNull: false,
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    authorizedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    capturedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    voidedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    refundedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'payments',
    timestamps: true,
  },
);

module.exports = Payment;
