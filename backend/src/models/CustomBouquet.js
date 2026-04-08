const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CustomBouquet = sequelize.define(
  "CustomBouquet",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.ENUM("sender", "recipient"),
      allowNull: false,
    },
    pricePoint: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    colors: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    flowerTypes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    containerStyle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    occasion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    extras: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "custom_bouquets",
    timestamps: true,
  },
);

module.exports = CustomBouquet;
