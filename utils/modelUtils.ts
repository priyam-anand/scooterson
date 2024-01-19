import bcrypt from "bcrypt";
import { BCRYPT_SALT } from "../config/config";
import logger from "./logger";

export async function hashPassword(password: string) {
  return new Promise(async (resolve, reject) => {
    try {
      const hashedPassword = await bcrypt.hash(password, Number(BCRYPT_SALT));
      resolve(hashedPassword);
    } catch (error) {
      logger.error(`Error in hashing password : ${error}`);
      reject(error);
      return;
    }
  });
}

export async function comparePassword(password: string, encrypted: string) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await bcrypt.compare(password, encrypted);
      resolve(result);
    } catch (error) {
      logger.error(`Error in comparing password ${error}`);
      reject(error);
      return;
    }
  });
}
