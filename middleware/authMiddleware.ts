import { Request, Response } from "express";
import { NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwtUtils";
import { User } from "../db/models/user";
import logger from "../utils/logger";

export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];
  logger.info(`Authenticating access token [token : ${accessToken}]`);

  if (!accessToken) {
    logger.info(`Access token missing`);
    res.status(401).json({ error: "Unauthorized - Missing token" });
    return;
  }

  try {
    const decodedToken = verifyAccessToken(accessToken);
    logger.info(`Searching for user with [token : ${accessToken}]`);

    const user = await User.findOne({ email: decodedToken.email });

    if (!user) {
      logger.info(`No user found with [token : ${accessToken}]`);
      res.status(401).json({ error: "Unauthorized - Invalid token" });
      return;
    }

    logger.info(`User found, authenticating [token : ${accessToken}]`);
    req.body.user = user;
    next();
  } catch (err) {
    logger.error(`Error in authenticating user with [token : ${accessToken}]`);
    res.status(401).json({ error: "Unauthorized - Invalid token" });
    return;
  }
}
