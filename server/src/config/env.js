const path = require("path");
const fs = require("fs");

// One .env file at the project root drives everything.
// Inside Docker there is no file, the values come from docker-compose instead.
const rootEnv = path.resolve(__dirname, "..", "..", "..", ".env");
const serverEnv = path.resolve(__dirname, "..", "..", ".env");
const envFile = [serverEnv, rootEnv].find((file) => fs.existsSync(file));
if (envFile) {
  require("dotenv").config({ path: envFile, quiet: true });
}

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.API_PORT || process.env.PORT || 8000),
  jwtSecret: process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "8h",
  corsOrigin: process.env.CORS_ORIGIN || "*",
  uploadDir: path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, "..", "..", "uploads")),
  loanDays: Number(process.env.LOAN_DAYS || 14),
  db: {
    dialect: process.env.DB_DIALECT || "mysql",
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    database: process.env.DB_NAME || process.env.DB_DATABASE || "online_library",
    username: process.env.DB_USER || process.env.DB_USERNAME || "library",
    password: process.env.DB_PASSWORD || "library",
    timezone: process.env.DB_TIMEZONE || "+07:00",
    storage: process.env.DB_STORAGE, // only used if you switch to sqlite
  },
  mail: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
    from: process.env.MAIL_FROM || "Online Library <no-reply@library.local>",
  },
};

if (!env.jwtSecret) {
  if (env.nodeEnv === "production") {
    throw new Error("JWT_SECRET is not set. Add it to your .env file.");
  }
  env.jwtSecret = "dev-only-secret-change-me";
  console.warn("JWT_SECRET is not set, using a throwaway dev secret.");
}

module.exports = env;
