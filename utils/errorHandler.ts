import { ErrorRequestHandler } from "express";
import { NODE_ENV } from "../config/config";
import logger from "./logger";

const onError: ErrorRequestHandler = (err, _req, res, _next) => {
  logger.error(err);
  res
    .status(500)
    .send(
      NODE_ENV === "development" && err?.message
        ? err?.message
        : "Unexpected Error occured"
    );
};

export default onError;
