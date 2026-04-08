const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { CREDIT_REASON_ENUM } = require('../constants/credits');

const CreditTransaction = sequelize.define(
  'CreditTransaction',
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
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    type: {
      type: DataTypes.ENUM('earn', 'redeem', 'adjustment'),
      allowNull: false,
    },
    reason: {
      type: DataTypes.ENUM(...CREDIT_REASON_ENUM),
      allowNull: false,
    },
  },
  {
    tableName: 'credit_transactions',
    timestamps: true,
  }
);

module.exports = CreditTransaction;
