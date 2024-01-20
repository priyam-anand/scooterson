import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import * as config from "./config/config";
import logger from "./utils/logger";
import connectDatabase from "./db/db";
import routes from "./routes";
import fs from "fs";
import https from "https";
import rateLimiter from "./middleware/ratelimiter";

const privateKey = fs.readFileSync("keys/client-key.pem", "utf8");
const certificate = fs.readFileSync("keys/client-cert.pem", "utf8");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(rateLimiter);

connectDatabase()
  .then(() => {
    // register routes
    app.use(routes);

    // Start the server
    const PORT = config.PORT;

    const credentials = {
      key: privateKey,
      cert: certificate,
    };
    var httpsServer = https.createServer(credentials, app);

    httpsServer.listen(PORT, () => {
      logger.info(`Server running at https://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    logger.error(`MongoDB Connection Error: ${error}`);
    process.exit(1);
  });
