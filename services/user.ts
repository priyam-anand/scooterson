import { User } from "../db/models/user";
import logger from "../utils/logger";

export async function changeRole(body: any) {
  try {
    const { role, user } = body;

    logger.info(
      `Updating role for [user : ${JSON.stringify(user)}, role : ${role}]`
    );

    await User.updateOne({ email: user.email }, { role });

    logger.info(
      `Updated role for [user : ${JSON.stringify(user)}, role : ${role}]`
    );

    return {
      data: {
        success: true,
      },
      error: undefined,
      status: 200,
    };
  } catch (err) {
    logger.error(
      `Error in changing role for [user : ${body.user} ] : ${err.stack}`
    );
    return {
      data: undefined,
      error: err?.message ? err.message : err,
      status: err?.status ? err.status : 500,
    };
  }
}
