import argon2 from "argon2";
import { getSessionTokenByID, invalidateSession, recordLogoutEvent } from "../../db/session.js";
import { fail, ok } from "../../utilities/message.js";
import errorCode from "../../utilities/errorCode.js";
import logger from "../../utilities/logger.js";

async function logoutService(sessionID, refreshToken) {
    try {
        logger.info({ sessionID }, "Starting logout");

        //Lookup the session row
        const result = await getSessionTokenByID(sessionID);

        if (result.rowCount === 0) {
            // Either already logged out or invalid session
            logger.warn({ sessionID }, "Logout failed: session not found");
            return fail(errorCode.NOT_FOUND, "No session found");
        }

        const tokenHash = result.rows[0].token_hash;
        const userID = result.rows[0].user_id;

        //Verify the refresh token
        const tokenMatch = await argon2.verify(tokenHash, refreshToken);

        if (!tokenMatch) {
            // Token doesn't match the session
            logger.warn({ sessionID, userID }, "Logout failed: invalid token");

            // For security, we can still respond with generic message
            return fail(errorCode.UNAUTHORIZED, "Invalid token");
        }

        //Invalidate the session/refresh token
        const invalidateResults = await invalidateSession(sessionID);

        if (invalidateResults.rowCount === 0) {
            // Could not invalidate
            logger.error({ sessionID, userID }, "Failed to invalidate session");
            return fail(errorCode.INTERNAL, "Can't invalidate refresh token");
        }

        //log the logout
        try {
            await recordLogoutEvent(userID, sessionID);
        } catch (logErr) {
            logger.error({ sessionID, userID, error: logErr }, "Failed to record logout event");
            // Do NOT fail the logout
            //logout still succeeded 
        }


        //Success
        logger.info({ sessionID, userID }, "Logout successful");
        return ok();

    } catch (error) {
        logger.error({ sessionID, error }, "Unexpected logout error");
        return fail(errorCode.INTERNAL, "Error during logout process");
    }
}




export default logoutService;