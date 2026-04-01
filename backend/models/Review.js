const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Review = sequelize.define(
  "Review",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
    },
    message:{
        type: DataTypes.TEXT,
        allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "reviews",
    timestamps: true,
  },
);

module.exports = Review;
