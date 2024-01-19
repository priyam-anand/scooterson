import mongoose from "mongoose";
import * as config from "../config/config";
import logger from "../utils/logger";

async function connectDatabase() {
  return new Promise(async (resolve, reject) => {
    try {
      logger.info(`Trying to connect to mongodb`);
      await mongoose.connect(config.MONGODB_URI);

      logger.info("Connected to MongoDB");
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}

export default connectDatabase;
