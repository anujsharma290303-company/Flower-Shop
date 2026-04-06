require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const sequelize = require("./config/database");

require("./models");

const authRoutes = require("./routes/authRoutes");
const {
  publicRouter: productPublic,
  adminRouter: productAdmin,
} = require("./routes/productRoutes");
const {
  publicRouter: categoryPublic,
  adminRouter: categoryAdmin,
} = require("./routes/categoryRoutes");
const faqRoutes = require("./routes/faqRoutes");
const siteConfigRoutes = require("./routes/siteConfigRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const DB_SYNC_ALTER = process.env.DB_SYNC_ALTER === "true";
const DB_SYNC_FORCE = process.env.DB_SYNC_FORCE === "true";

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
app.use("/api/products", productPublic);
app.use("/api/categories", categoryPublic);
app.use("/api/faqs", faqRoutes);
app.use("/api/siteconfig", siteConfigRoutes);
app.use("/api/reviews", reviewRoutes);

// Admin routes
app.use("/api/admin/products", productAdmin);
app.use("/api/admin/categories", categoryAdmin);

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ message: "Internal server error" });
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");
    await sequelize.sync({ alter: DB_SYNC_ALTER, force: DB_SYNC_FORCE });
    console.log("✅ Database synchronized");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Startup failed:", err.message);
    process.exit(1);
  }
};

startServer();
