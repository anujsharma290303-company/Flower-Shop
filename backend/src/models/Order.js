const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      
    },
    customerPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    senderDisplayName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    recipientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recipientEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    recipientPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    



    deliveryAddressType: {
      type: DataTypes.ENUM('residence', 'business'),
      allowNull: true,
      defaultValue: 'residence',
    },
    businessName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    addressLine1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    addressLine2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deliveryAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '',
    },
    deliveryDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    country: {
      type: DataTypes.ENUM('US', 'CA'),
      allowNull: false,
      defaultValue: 'US',
    },
    currency: {
      type: DataTypes.ENUM('USD', 'CAD'),
      allowNull: false,
      defaultValue: 'USD',
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '',
    },
    messageToRecipient: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '',
    },
    cardMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '',
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "authorized",
        "paid",
        "awaiting_recipient",
        "recipient_accepted",
        "processing",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "expired",
      ),
      allowNull: false,
      defaultValue: "pending",
    },
    paymentStatus: {
      type: DataTypes.ENUM("unpaid", "authorized", "paid", "refunded", "voided"),
      defaultValue: "unpaid",
    },
    deliveryMode: {
      type: DataTypes.ENUM("recipient-provides", "sender-provides", "social-media"),
      defaultValue: "recipient-provides",
    },
    creditsEarned: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    creditsUsed: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isSubscription: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    subscriptionFrequency: {
      type: DataTypes.ENUM("weekly", "biweekly", "monthly"),
      allowNull: true,
    },
    isRecipientChoice: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "orders",
    timestamps: true,
  },
);

module.exports = Order;
