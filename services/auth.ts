import { User } from "../db/models/user";
import { comparePassword, hashPassword } from "../utils/modelUtils";
import logger from "../utils/logger";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  verifyRefreshToken,
} from "../utils/jwtUtils";
import { authError } from "../utils/error";

export async function registerUser(body: any) {
  try {
    const { email, password } = body;
    logger.info(`Registering user [email : ${email}]`);

    // check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw authError("Email is already taken", 409);
    }

    // Generate and access and refresh tokens
    const tokens = getJwtTokens(email);

    // create new user
    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      email,
      password: hashedPassword,
      refreshTokenHash: tokens.hashedRefreshToken,
      role: "USER",
    });
    await newUser.save();

    logger.info(`Registered new user [user : ${JSON.stringify(newUser)}]`);

    return {
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
      error: undefined,
      status: 201,
    };
  } catch (err) {
    logger.error(
      `Error in registering user [email : ${body.email} ] : ${err?.stack}`
    );
    return {
      data: undefined,
      error: err?.message ? err.message : err,
      status: err?.status ? err.status : 500,
    };
  }
}

export async function loginUser(body: any) {
  try {
    const { email, password } = body;
    logger.info(`Logging in user [email : ${email}]`);

    // find the user
    const user = await User.findOne({ email });
    if (!user) {
      throw authError("Invalid email or password", 401);
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw authError("Invalid email or password", 401);
    }

    logger.info(`Logged in user [email : ${email}]`);

    // Generate and access and refresh tokens
    const tokens = getJwtTokens(email);
    await User.updateOne(
      { email },
      { refreshTokenHash: tokens.hashedRefreshToken }
    );

    logger.info(`Updated user's refresh token [email : ${email}]`);

    return {
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
      error: undefined,
      status: 200,
    };
  } catch (err) {
    logger.error(
      `Error in loggin in user [email : ${body.email} ] : ${err?.stack}`
    );
    return {
      data: undefined,
      error: err?.message ? err.message : err,
      status: err?.status ? err.status : 500,
    };
  }
}

export async function refreshAccessToken(body: any) {
  try {
    const { refreshToken } = body;
    logger.info(`Refreshing token for user [token : ${refreshToken}]`);

    // get decoded token data
    const data = verifyRefreshToken(refreshToken);
    const user = await User.findOne({ email: data.email });

    const hashedRefreshToken = hashToken(refreshToken);

    // compare tokens
    if (!user || hashedRefreshToken !== user.refreshTokenHash) {
      throw authError("Invalid refresh token.", 401);
    }

    logger.info(`Found user and refreshing tokens [email : ${data.email}]`);

    // generate and save new tokens
    const tokens = getJwtTokens(user.email);
    await User.updateOne(
      { email: user.email },
      { refreshTokenHash: tokens.hashedRefreshToken }
    );

    logger.info(`Updated user's refresh token [email : ${user.email}]`);

    return {
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
      error: undefined,
      status: 200,
    };
  } catch (err) {
    logger.error(`Error in using refresh token : ${err?.stack}`);
    return {
      data: undefined,
      error: err?.message ? err.message : err,
      status: err?.status ? err.status : 500,
    };
  }
}

function getJwtTokens(email: string) {
  const accessToken = generateAccessToken(email);
  const refreshToken = generateRefreshToken(email);
  const hashedRefreshToken = hashToken(refreshToken);

  return { accessToken, refreshToken, hashedRefreshToken };
}
