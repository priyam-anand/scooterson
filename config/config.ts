export const PORT = process.env.PORT || 3000;
export const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/db";
export const JWT = {
  secret: process.env.JWT_SECRET || "secret_key",
  expiresIn: "1h", // 1 hour
  refreshSecret: process.env.JWT_REFRESH_SECRET || "refresh_key",
  refreshExpiresIn: "7d", // 7 days
};
export const NODE_ENV = process.env.NODE_ENV || "development";
