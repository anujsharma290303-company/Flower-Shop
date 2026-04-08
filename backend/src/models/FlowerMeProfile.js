const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FLOWER_ME_TIERS = ['society', 'socialite', 'royale'];

const FlowerMeProfile = sequelize.define(
  'FlowerMeProfile',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tagline: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    photoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    socialLink: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    followersCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    tier: {
      type: DataTypes.ENUM(...FLOWER_ME_TIERS),
      allowNull: false,
      defaultValue: 'society',
    },
    wishlistNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: 'flower_me_profiles',
    timestamps: true,
  },
);

module.exports = FlowerMeProfile;
