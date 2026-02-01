import jwt from "jsonwebtoken";
import env from "../../config/env.js";
import { ok, fail, Result } from "../../utilities/message.js";



/**
 * returns the decoded token if valid, otherwise returns fail
 * {
 *  id: 'a0b65625-3132-4adf-92d6-966524111b3b',
 *  iat: 1769916348,
 *  exp: 1769919948
 *}
 */
export function verifyAccessToken(token: string): Result<string | jwt.JwtPayload> {
    try {
        const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET);
        return ok(decoded);
    } catch (err) {
        return fail();
    }
}
