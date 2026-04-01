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
    recipientPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deliveryAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "confirmed",
        "out for delivery",
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
