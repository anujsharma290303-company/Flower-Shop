const path = require('path');
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Load env files reliably for local monorepo runs while still allowing host-injected vars.
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.DATABASE_PUBLIC_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRESQL_URL;

if (!databaseUrl) {
  throw new Error(
    'Database connection URL is missing. Set one of: DATABASE_URL, DATABASE_PUBLIC_URL, POSTGRES_URL, POSTGRESQL_URL.'
  );
}

const useSsl = process.env.DB_SSL
  ? process.env.DB_SSL === 'true'
  : process.env.NODE_ENV === 'production';

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: useSsl
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
  logging: false, // turn off SQL query logs
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = sequelize;