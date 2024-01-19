import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import * as config from "./config/config";
import onError from "./utils/errorHandler";
import logger from "./utils/logger";
import connectDatabase from "./db/db";
import routes from "./routes";

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDatabase()
  .then(() => {
    // register routes
    app.use(routes);

    // Error handling middleware
    app.use(onError);

    // Start the server
    const PORT = config.PORT;
    app.listen(PORT, () => {
      logger.info(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    logger.error(`MongoDB Connection Error: ${error}`);
    process.exit(1);
  });
