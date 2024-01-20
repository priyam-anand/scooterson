import { Request, Response } from "express";
import { NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwtUtils";
import { User, roles } from "../db/models/user";
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
    logger.error(
      `Error in authenticating user with [token : ${accessToken}] : ${err.stack}`
    );
    res.status(401).json({ error: "Unauthorized - Invalid token" });
    return;
  }
}

export function authenticateAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    logger.info(
      `Authenticating user for admin access [user : ${JSON.stringify(
        req.body.user
      )}]`
    );
    const result = authenticateRole("ADMIN", req.body.user);
    if (!result) {
      logger.info(`Invalid role for [user : ${JSON.stringify(req.body.user)}]`);
      res.status(401).json({ error: "Unauthorized - Insufficient privilege" });
      return;
    }

    logger.info(
      `Correct role found [user : ${JSON.stringify(
        req.body.user
      )}, role : ADMIN]`
    );
    next();
  } catch (err) {
    logger.error(
      `Error authenticating for admin role [user : ${req.body.user} ] : ${err.stack}`
    );
    res.status(401).json({ error: "Unauthorized - Insufficient privilege" });
    return;
  }
}

export async function authenticateOperator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    logger.info(
      `Authenticating user for operator access [user : ${JSON.stringify(
        req.body.user
      )}]`
    );
    const result = authenticateRole("OPERATOR", req.body.user);
    if (!result) {
      logger.info(`Invalid role for [user : ${JSON.stringify(req.body.user)}]`);
      res.status(401).json({ error: "Unauthorized - Insufficient privilege" });
      return;
    }

    logger.info(
      `Correct role found [user : ${JSON.stringify(
        req.body.user
      )}, role : OPERATOR]`
    );
    next();
  } catch (err) {
    logger.error(
      `Error authenticating for operator role [user : ${req.body.user} ] : ${err.stack}`
    );
    res.status(401).json({ error: "Unauthorized - Insufficient privilege" });
    return;
  }
}

export async function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    logger.info(
      `Authenticating user for user access [user : ${JSON.stringify(
        req.body.user
      )}]`
    );
    const result = authenticateRole("USER", req.body.user);
    if (!result) {
      logger.info(`Invalid role for [user : ${JSON.stringify(req.body.user)}]`);
      res.status(401).json({ error: "Unauthorized - Insufficient privilege" });
      return;
    }

    logger.info(
      `Correct role found [user : ${JSON.stringify(
        req.body.user
      )}, role : USER]`
    );
    next();
  } catch (err) {
    logger.error(
      `Error authenticating for user role [user : ${req.body.user} ] : ${err.stack}`
    );
    res.status(401).json({ error: "Unauthorized - Insufficient privilege" });
    return;
  }
}

function authenticateRole(role: string, user: any) {
  const level = roles.indexOf(user.role);
  const levelRequired = roles.indexOf(role);
  return levelRequired <= level;
}
