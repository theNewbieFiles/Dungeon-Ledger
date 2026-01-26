import argon2id from "argon2";
import { getUserByEmail } from "../../db/dbUser.js";
import { fail, ok } from "../../utilities/message.js";
import { loginSchema } from "../../validation/authLoginSchema.js";
import { createSession } from "../../auth/session/createSession.js";
import { generateAccessToken } from "../../auth/accessToken/generateAccessToken.js";
import errorCode from "../../utilities/errorCode.js";



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
        const refreshToken = await createSession({
            userId: user.id,
            userAgent: session.userAgent,
            ipAddress: session.ipAddress,
        });

        //create access token
        const accessToken = generateAccessToken(user.id);

        return ok({
            accessToken: accessToken,
            refreshToken: refreshToken,
        }); 


    } catch (error) {
        throw new Error("Error creating tokens", { cause: error });
    }


}   

export default loginService;