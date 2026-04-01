const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SiteConfig = sequelize.define(
  "SiteConfig",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    heroTitle: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Fresh Flowers for Every Occasion",
    },
    heroSubTitle: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "Handcrafted bouquets delivered with care and love.",
    },
    heroCTA1: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Shop Now",
    },
    heroCTA2: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "View Subscriptions",
    },
    heroImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    howItWorks: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [
        {
          step: 1,
          title: "Choose",
          description:
            "Pick your favorite flowers from our curated collection.",
        },
        {
          step: 2,
          title: "Order",
          description: "Place your order in minutes with secure checkout.",
        },
        {
          step: 3,
          title: "Deliver",
          description: "We deliver fresh blooms to your doorstep on time.",
        },
      ],
    },
    benefitsData: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    contactEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "contact@flowerstore.com",
    },
    contactPhone: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "+1 (555) 123-4567",
    },
    socialLinks: {
      type: DataTypes.JSONB,
      defaultValue: {
        facebook: "https://www.facebook.com/yourpage",
        instagram: "https://www.instagram.com/yourprofile",
        twitter: "https://www.twitter.com/yourprofile",
      },
    },
  },
  {
    tableName: "site_configs",
    timestamps: true,
  },
);

module.exports = SiteConfig;
