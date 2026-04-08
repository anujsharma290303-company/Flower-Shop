require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const sequelize = require("./config/database");

require("./models");

const authRoutes = require("./routes/authRoutes");
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const adminRoutes = require("./routes/adminRoutes");
const {
  publicRouter: productPublic,
  adminRouter: productAdmin,
} = require("./routes/productRoutes");
const {
  publicRouter: categoryPublic,
  adminRouter: categoryAdmin,
} = require("./routes/categoryRoutes");
const {
  publicRouter: orderPublic,
  adminRouter: orderAdmin,
} = require("./routes/orderRoutes");
const {
  publicRouter: faqPublic,
  adminRouter: faqAdmin,
} = require("./routes/faqRoutes");
const {
  publicRouter: siteConfigPublic,
  adminRouter: siteConfigAdmin,
} = require("./routes/siteConfigRoutes");
const {
  publicRouter: reviewPublic,
  adminRouter: reviewAdmin,
} = require("./routes/reviewRoutes");
const {
  publicRouter: blogPublic,
  adminRouter: blogAdmin,
} = require("./routes/blogRoutes");
const {
  publicRouter: bouquetPublic,
  adminRouter: bouquetAdmin,
} = require("./routes/customBouquetRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminPaymentRoutes = require("./routes/adminPaymentRoutes");
const {
  publicRouter: subscriptionPublic,
  adminRouter: subscriptionAdmin,
} = require("./routes/subscriptionRoutes");
const creditsRoutes = require("./routes/creditsRoutes");
const {
  publicRouter: deliveryPublic,
  adminRouter: deliveryAdmin,
} = require("./routes/deliveryRoutes");
const contactRoutes = require("./routes/contactRoutes");
const recipientRoutes = require("./routes/recipientRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const { expirePendingRecipientTokens } = require("./controllers/recipientController");

const app = express();
const PORT = process.env.PORT || 5000;
const DB_SYNC_ALTER = process.env.DB_SYNC_ALTER === "true";
const DB_SYNC_FORCE = process.env.DB_SYNC_FORCE === "true";
const ORDER_EXPIRY_SWEEP_INTERVAL_MS = Number(process.env.ORDER_EXPIRY_SWEEP_INTERVAL_MS || 15 * 60 * 1000);

// Security
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests, please try again later." },
});
app.use("/api/", limiter);

// Logging + parsing
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is healthy" });
});

// Public routes
app.use("/api/auth", authRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/auth/admin", adminAuthRoutes);
app.use("/api/products", productPublic);
app.use("/api/categories", categoryPublic);
app.use("/api/orders", orderPublic);
app.use("/api/faqs", faqPublic);
app.use("/api/siteconfig", siteConfigPublic);
app.use("/api/reviews", reviewPublic);
app.use("/api/blogs", blogPublic);
app.use("/api/bouquets", bouquetPublic);
app.use("/api/payments", paymentRoutes);
app.use("/api/subscriptions", subscriptionPublic);
app.use("/api/credits", creditsRoutes);
app.use("/api/delivery", deliveryPublic);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/recipient", recipientRoutes);

// Admin shared routes
app.use("/api/admin", adminRoutes);

// Admin routes
app.use("/api/admin/products", productAdmin);
app.use("/api/admin/categories", categoryAdmin);
app.use("/api/admin/orders", orderAdmin);
app.use("/api/admin/faqs", faqAdmin);
app.use("/api/admin/siteconfig", siteConfigAdmin);
app.use("/api/admin/reviews", reviewAdmin);
app.use("/api/admin/blogs", blogAdmin);
app.use("/api/admin/bouquets", bouquetAdmin);
app.use("/api/admin/payments", adminPaymentRoutes);
app.use("/api/admin/subscriptions", subscriptionAdmin);
app.use("/api/admin/delivery", deliveryAdmin);
app.use("/api/admin/notifications", notificationRoutes);
app.use("/api/admin/media", mediaRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ success: false, message: "Internal server error" });
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");
    await sequelize.sync({ alter: DB_SYNC_ALTER, force: DB_SYNC_FORCE });
    console.log("✅ Database synchronized");

    try {
      const initialExpirySweep = await expirePendingRecipientTokens();
      console.log(`✅ Recipient token expiry sweep complete: expired=${initialExpirySweep.expiredCount}, voided=${initialExpirySweep.voidedCount}`);
    } catch (error) {
      console.error("⚠️ Recipient token expiry sweep failed on startup:", error.message);
    }

    if (ORDER_EXPIRY_SWEEP_INTERVAL_MS > 0) {
      setInterval(() => {
        expirePendingRecipientTokens()
          .then((result) => {
            console.log(`✅ Recipient token expiry sweep complete: expired=${result.expiredCount}, voided=${result.voidedCount}`);
          })
          .catch((error) => {
            console.error("⚠️ Recipient token expiry sweep failed:", error.message);
          });
      }, ORDER_EXPIRY_SWEEP_INTERVAL_MS);
    }

    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Startup failed:", err.message);
    process.exit(1);
  }
};

startServer();
