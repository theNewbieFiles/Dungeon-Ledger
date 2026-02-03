import { invalidateSession, recordLogoutEvent } from "../../db/session.js";
import { fail, ok } from "../../utilities/message.js";
import logger from "../../utilities/logger.js";
import { verifySessionToken } from "../../utilities/verifySessionToken.js";
import type { Result } from "../../utilities/message.js";

async function logoutService(sessionID: string, refreshToken: string): Promise<Result<void>> {

    logger.info({ sessionID }, "Starting logout");

    //Lookup the session row
    const result = await verifySessionToken(sessionID, refreshToken);

    if (!result.success) {
        return fail();
    }

    const userID = result.data.user_id;


    //Invalidate the session/refresh token
    const invalidateResults = await invalidateSession(sessionID);

    if (!invalidateResults) {
        // Could not invalidate
        logger.error({ sessionID, userID }, "Failed to invalidate session");
        return fail();
    }

    //log the logout
    try {
        await recordLogoutEvent(userID, sessionID);
    } catch (err) {
        logger.error({ sessionID, userID, err }, "Failed to record logout event");
        // Do NOT fail the logout
    }



    //Success
    logger.info({ sessionID, userID }, "Logout successful");
    return ok();


}


export default logoutService;