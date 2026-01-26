
/**
 * Module for creating JWT access tokens.
 * @module auth/accessToken/createAccessToken
 */
import jwt from "jsonwebtoken";
import AppConfig from "../../config/appConfig.js";
import env from "../../config/env.js";

/**
 * Creates a signed JWT access token for a user.
 *
 * @param {string} user_id - The unique identifier for the user (used as the subject of the token).
 * @returns {string} The signed JWT access token.
 */
export function generateAccessToken(user_id) {
  
    return jwt.sign(
        {
            sub: user_id,
        },
        env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: AppConfig.ACCESS_TOKEN_TTL,
        },
    );
}
