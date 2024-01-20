import jwt from "jsonwebtoken";
import crypto from "crypto";
import { JWT } from "../config/config";
import { JwtPayload } from "./interfaces";

export function generateAccessToken(email: string) {
  return jwt.sign({ email: email }, JWT.secret, {
    expiresIn: JWT.expiresIn,
  });
}

export function generateRefreshToken(email: string) {
  return jwt.sign({ email: email }, JWT.refreshSecret, {
    expiresIn: JWT.refreshExpiresIn,
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, JWT.secret) as JwtPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, JWT.refreshSecret) as JwtPayload;
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
