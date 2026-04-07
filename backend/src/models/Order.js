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
    



    deliveryAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '',
    },
    deliveryDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    message: {
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
        "paid",
        "awaiting_recipient",
        "recipient_accepted",
        "processing",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ),
      allowNull: false,
      defaultValue: "pending",
    },
    paymentStatus: {
      type: DataTypes.ENUM("unpaid", "paid", "refunded"),
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
