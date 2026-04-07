const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderMedia = sequelize.define(
  'OrderMedia',
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    mediaUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    mediaType: {
      type: DataTypes.ENUM('photo', 'video'),
      allowNull: false,
    },
    sharedWith: {
      type: DataTypes.ENUM('sender', 'public'),
      allowNull: false,
      defaultValue: 'public',
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'order_media',
    timestamps: true,
  }
);

module.exports = OrderMedia;
