import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import * as config from "./config/config";
import onError from "./utils/errorHandler";
import logger from "./utils/logger";

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
mongoose.connect(config.MONGODB_URI);

mongoose.connection.on("error", (err) => {
  logger.error(`MongoDB Connection Error: ${err}`);
  process.exit(1);
});

mongoose.connection.once("open", () => {
  logger.info("Connected to MongoDB");

  // Routes
  const authRoutes = require("./routes/authRoutes");
  const userRoutes = require("./routes/userRoutes");
  const protectedRoutes = require("./routes/protectedRoutes");

  app.use("/api/auth", authRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/protected", protectedRoutes);

  // Error handling middleware
  app.use(onError);

  // Start the server
  const PORT = config.PORT;
  app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
  });
});
