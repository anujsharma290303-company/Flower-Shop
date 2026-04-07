const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const NotificationLog = sequelize.define(
  'NotificationLog',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.ENUM(
        'contact',
        'recipient-link',
        'order-confirmation',
        'order-status',
        'payment-received',
        'recipient-accepted',
        'delivery-update',
        'other'
      ),
      allowNull: false,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Where notification came from (e.g., contact-form, order-system, recipient-flow)',
    },
    recipient: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Email or phone number recipient (if it were to be sent)',
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Additional data (orderId, contactId, link, etc.)',
    },
    status: {
      type: DataTypes.ENUM('logged', 'sent', 'failed', 'pending'),
      defaultValue: 'logged',
    },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'notification_logs',
    timestamps: true,
  }
);

module.exports = NotificationLog;
