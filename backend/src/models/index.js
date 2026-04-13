const sequelize = require("../config/database");
const Admin = require("./Admin");
const User = require("./User");
const CreditTransaction = require("./CreditTransaction");
const OrderMedia = require("./OrderMedia");
const Category = require("./Category");
const Product = require("./Product");
const Order = require("./Order");
const OrderItem = require("./OrderItem");
const OrderStatusLog = require("./OrderStatusLog");
const RecipentAccessToken = require("./RecipentAccessToken");
const Review = require("./Review");
const CustomBouquet = require("./CustomBouquet");
const Blog = require("./Blog");
const FAQ = require("./FAQ");
const SiteConfig = require("./SiteConfig");
const Payment = require("./Payment");
const NotificationLog = require("./NotificationLog");
const Subscription = require("./Subscription");
const DeliveryBlackoutDate = require("./DeliveryBlackoutDate");
const Wishlist = require('./wishlist');
const FlowerMeProfile = require('./FlowerMeProfile');

// Associations

// Category->Self (for subcategories)
Category.hasMany(Category, { as: "subcategories", foreignKey: "parentId" });
Category.belongsTo(Category, { as: "parent", foreignKey: "parentId" });

// Category->Product
Category.hasMany(Product, { foreignKey: "categoryId" ,as: "products"});
Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

// Order->OrderItem
Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });

// Order->OrderStatusLog
Order.hasMany(OrderStatusLog, { foreignKey: "orderId", as: "statusLogs" });
OrderStatusLog.belongsTo(Order, { foreignKey: "orderId", as: "order" });

// Product->OrderItem
Product.hasMany(OrderItem, { foreignKey: "productId", as: "orderItems" });
OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

// Order->RecipentAccessToken
Order.hasMany(RecipentAccessToken, { foreignKey: "orderId", as: "recipentTokens" });
RecipentAccessToken.belongsTo(Order, { foreignKey: "orderId", as: "order" });

// Product->RecipentAccessToken (for chosen product in custom bouquet)
Product.hasMany(RecipentAccessToken, { foreignKey: "choosenProductId", as: "choesenFor" });
RecipentAccessToken.belongsTo(Product, { foreignKey: "choosenProductId", as: "chosenProduct" });

// Order->Review
Order.hasOne(Review, { foreignKey: "orderId", as: "review" });
Review.belongsTo(Order, { foreignKey: "orderId", as: "order" });

// Order->CustomBouquet
Order.hasMany(CustomBouquet, { foreignKey: "orderId", as: "customBouquets" });
CustomBouquet.belongsTo(Order, { foreignKey: "orderId", as: "order" });

// Order->Payment
Order.hasMany(Payment, { foreignKey: "orderId", as: "payments" });
Payment.belongsTo(Order, { foreignKey: "orderId", as: "order" });

// User->Order
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User->CreditTransaction
User.hasMany(CreditTransaction, { foreignKey: 'userId', as: 'creditTransactions' });
CreditTransaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User->OrderMedia
User.hasMany(OrderMedia, { foreignKey: 'userId', as: 'sharedMedia' });
OrderMedia.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Order->OrderMedia
Order.hasMany(OrderMedia, { foreignKey: 'orderId', as: 'media' });
OrderMedia.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// Order->CreditTransaction
Order.hasMany(CreditTransaction, { foreignKey: 'orderId', as: 'creditTransactions' });
CreditTransaction.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// User->Subscription
User.hasMany(Subscription, { foreignKey: 'userId', as: 'subscriptions' });
Subscription.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Order->Subscription
Order.hasMany(Subscription, { foreignKey: 'orderId', as: 'subscriptions' });
Subscription.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// User->Wishlist
User.hasMany(Wishlist, { foreignKey: 'userId', as: 'wishlists' });
Wishlist.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User->FlowerMeProfile
User.hasOne(FlowerMeProfile, { foreignKey: 'userId', as: 'flowerMeProfile' });
FlowerMeProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });


// Export all models
module.exports = {
  sequelize,
  Admin,
  User,
  CreditTransaction,
  OrderMedia,
  Category,
  Product,
  Order,
  OrderItem,
  OrderStatusLog,
  RecipentAccessToken,
  Review,
  CustomBouquet,
  Blog,
  FAQ,
  SiteConfig,
  Payment,
  NotificationLog,
  Subscription,
  DeliveryBlackoutDate,
  Wishlist,
  FlowerMeProfile,
};
