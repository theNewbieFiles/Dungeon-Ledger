import argon2id from "argon2";
import { getUserByEmail } from "../../db/user.js";
import { fail, ok } from "../../utilities/message.js";
import { loginSchema } from "../../validation/authLoginSchema.js";
import { createSession } from "../../auth/session/createSession.js";
import { generateAccessToken } from "../../auth/accessToken/generateAccessToken.js";
import errorCode from "../../utilities/errorCode.js";
import { recordLoginEvent } from "../../db/session.js";


/**
 * Authenticates a user using email and password, verifies credentials with Argon2id,
 * and issues both an access token and a refresh session token.
 *
 * This function performs:
 *  - Input validation using Zod
 *  - User lookup by email
 *  - Timing‑safe password verification (Argon2id)
 *  - Refresh‑session creation (stored in DB)
 *  - Access‑token generation (JWT)
 *
 * @async
 * @function loginService
 *
 * @param {Object} params
 * @param {string} params.email - The user's email address.
 * @param {string} params.password - The plaintext password provided by the user.
 * @param {Object} [params.session] - Metadata describing the login session.
 * @param {string} [params.session.userAgent=""] - The client's user agent string.
 * @param {string} [params.session.ipAddress=""] - The client's IP address.
 *
 * @returns {Promise<Object>} A standardized success or failure response.
 * 

 * @throws {Error} If token creation fails unexpectedly.
 */
async function loginService({ email, password, session = { userAgent: "", ipAddress: "" } }) {

    //validate input with zod
    const parsedResult = loginSchema.safeParse({ email, password });

    if (!parsedResult.success) {
        return fail(errorCode.BAD_REQUEST, "Invalid email or password format");
    }

    //get user by email
    const results = await getUserByEmail(email);

    //if no user found
    if (results.rowCount === 0) {
        return fail(errorCode.INVALID_CREDENTIALS, "Invalid email or password");
    }

  
    //get user data
    const user = results.rows[0];

    //verify password
    const passwordMatch = await argon2id.verify(user.password_hash, password);

    if (!passwordMatch) {
        return fail(errorCode.INVALID_CREDENTIALS, "Invalid email or password");
    }

    try {
        //create refresh token
        const results = await createSession({
            userId: user.id,
            userAgent: session.userAgent,
            ipAddress: session.ipAddress,
        });

        if(!results.success){
            //error
            //TODO:
        }

        //log the login event
        recordLoginEvent(user.id, results.data.sessionID);


        //create access token
        const accessToken = generateAccessToken(user.id);

        return ok({
            accessToken: accessToken,
            refreshToken: results.data.refreshToken,
            sessionID: results.data.sessionID,
        });  


    } catch (error) {
        throw new Error("Error creating tokens", { cause: error });
    }


}   

export default loginService;