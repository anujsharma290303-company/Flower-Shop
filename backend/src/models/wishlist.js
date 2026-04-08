const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Wishlist = sequelize.define(
  'Wishlist',
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
    token: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      defaultValue: DataTypes.UUIDV4,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: 'wishlists',
    timestamps: true,
  },
);

module.exports = Wishlist;