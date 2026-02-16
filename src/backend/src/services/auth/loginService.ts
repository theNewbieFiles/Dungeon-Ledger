import argon2id from "argon2";
import { getUserByEmail } from "../../db/user.js";
import { fail, ok } from "../../utilities/message.js";
import { loginSchema } from "../../validation/authLoginSchema.js";
import { createSession } from "../../auth/session/createSession.js";
import { generateAccessToken } from "../../auth/accessToken/generateAccessToken.js";
import { recordLoginEvent } from "../../db/session.js";
import logger from "../../utilities/logger.js";

export interface loginServiceParams {
    email: string;
    password: string;
    session: {
        userAgent: string,
        ipAddress: string,
    }
}

async function loginService(params: loginServiceParams) {
    const {
        email,
        password,
        session,
    } = params;

    //validate input with zod
    const parsedResult = loginSchema.safeParse({ email, password });

    if (!parsedResult.success) {
        return fail();
    }

    //get user by email
    const userData = await getUserByEmail(email);

    //if no user found
    if (!userData.success) {
        return fail();
    }


    //get user data
    const { id, passwordHash } = userData.data;

    //verify password
    const passwordMatch = await argon2id.verify(passwordHash, password);

    if (!passwordMatch) {
        return fail();
    }

    //create refresh token
    const sessionResults = await createSession({
        userID: id,
        userAgent: session.userAgent,
        ipAddress: session.ipAddress,
    });

    if (!sessionResults.success) {
        return fail();
    }

    const { refreshToken, sessionID } = sessionResults.data; 

    //create access token
    const accessToken = generateAccessToken(id);
    
    
    //log the login event
    try {
        await recordLoginEvent(id, sessionID);
    } catch (error) {
        //failure here shouldn't block login
        logger.error({ sessionID }, "Failed to record login event");
        console.error("Failed to record login event:", error);
    }

    return ok({
        accessToken: accessToken,
        refreshToken: refreshToken,
        sessionID: sessionID,
    });


}

export default loginService;