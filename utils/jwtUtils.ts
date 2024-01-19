import jwt from "jsonwebtoken";
import crypto from "crypto";
import { JWT } from "../config/config";
import { JwtPayload } from "./interfaces";

// Generate an access token
export function generateAccessToken(email: string) {
  return jwt.sign({ email: email }, JWT.secret, {
    expiresIn: JWT.expiresIn,
  });
}

// Generate a refresh token
export function generateRefreshToken(email: string) {
  return jwt.sign({ email: email }, JWT.refreshSecret, {
    expiresIn: JWT.refreshExpiresIn,
  });
}

// Verify an access token
export function verifyAccessToken(token: string) {
  return jwt.verify(token, JWT.secret);
}

// Verify a refresh token
export function verifyRefreshToken(token: string) {
  return jwt.verify(token, JWT.refreshSecret) as JwtPayload;
}

// Generate hash of a token token
export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
