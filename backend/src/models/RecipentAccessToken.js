const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const RecipentAccessToken = sequelize.define(
  "RecipentAccessToken",
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
    token: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "declined", "expired"),
    
      defaultValue: "pending",
    },
    recipentName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recipentEmail: {
      type: DataTypes.STRING,
    },
    choosenProductId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    chosenDeliveryDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    chosenDeliveryAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    chosenCardName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    acceptedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    declinedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "recipent_access_tokens",
    timestamps: true,
  },
);

module.exports = RecipentAccessToken;
