require("dotenv").config();
const bcrypt = require("bcryptjs");
const sequelize = require("../config/database");
const { Admin } = require("../models");

const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@flower-shop.com";
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

const seedAdmin = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Database connection established.");

        // Only sync the Admin model (skip full sync to avoid ENUM alter issues)
        await Admin.sync({ alter: false });
        console.log("✅ Admin table ready.");

        const existingAdmin = await Admin.findOne({
            where: { email: DEFAULT_ADMIN_EMAIL },
        });

        if (existingAdmin) {
            console.log("⚠️ Admin already exists. Skipping seed.");
            return;
        }

        const passwordHash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 12);

        await Admin.create({
            email: DEFAULT_ADMIN_EMAIL,
            passwordHash,
            role: "superadmin",
            isActive: true,
        });

        console.log("✅ Admin user created successfully.");
    } catch (error) {
        console.error("❌ Error seeding admin user:", error.message);
        process.exitCode = 1;
    } finally {
        await sequelize.close();
        console.log("✅ Database connection closed.");
    }
};

seedAdmin();

