import argon2 from "argon2";
import { getSessionTokenByID, type SessionTokenRow } from "../db/session.js";
import logger from "./logger.js";
import { fail, ok, type Result } from "./message.js";



export async function verifySessionToken(sessionID: string, refreshToken: string): Promise<Result<SessionTokenRow>> {

    //Lookup the session row
    const result = await getSessionTokenByID(sessionID);

    if (!result) {
        // Either already logged out or invalid session
        logger.warn({ sessionID }, "Session not found");
        return fail();
    }
    

    //is the session and token expired?
    const now = new Date();
    if (result.expires_at <= now) {
        logger.warn({ sessionID, userID: result.user_id, expiresAt: result.expires_at}, "Session expired");
        return fail();
    }

    const tokenHash = result.token_hash;

    //Verify the refresh token
    const tokenMatch = await argon2.verify(tokenHash, refreshToken);

    if (!tokenMatch) {
        // Token doesn't match the session
        logger.warn({ sessionID, userID: result.user_id }, "Token mismatch");

        return fail();
    }

    //there is a session and the token presented matches token in the database and isn't expired
    return ok(result);
} 