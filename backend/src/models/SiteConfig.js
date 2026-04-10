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
    flowerMeTitle: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'The FlowerMe Society is Here!',
    },
    flowerMeDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'A new way to be celebrated, receive flowers, and feel adored. Watch the video below and learn more.',
    },
    flowerMeVideoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'https://cdn.socialflowers.com/flowerme/Blooming_This_Fall_2025.mp4#t=0.001',
    },
    flowerMeThumbnailUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'https://cdn.socialflowers.com/thumbnails/flowerme/Blooming_This_Fall_2025.mp4.0000024.jpg',
    },
    customBouquetsHeading: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Send Flowers Easily With Custom Bouquets',
    },
    recipientsChoiceImage: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'https://cdn.floristone.com/large/recipients-choice-thumb.jpg',
    },
    sendersChoiceImage: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'https://cdn.floristone.com/large/senders-choice.jpg',
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
