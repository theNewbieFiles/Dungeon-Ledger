import { generateAccessToken } from "../../auth/accessToken/generateAccessToken.js";
import logger from "../../utilities/logger.js";
import { fail, ok, Result } from "../../utilities/message.js";
import { verifySessionToken } from "../../utilities/verifySessionToken.js";


export async function accessTokenRefreshService(sessionID: string, refreshToken: string): Promise<Result<string>> {
    //Lookup the session db
    const verification  = await verifySessionToken(sessionID, refreshToken);

    if (!verification.success) {
        return fail();
    }

    // Successfully verified session

    const userID = verification.data.user_id;

    //generate new access token
    const newToken = generateAccessToken(userID);

    logger.info({ sessionID, userID }, "Access token refreshed successfully");

    return ok(newToken);

}     