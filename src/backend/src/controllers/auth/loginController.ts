import type { Request, Response } from 'express';
import AppConfig from "../../config/appConfig.js";
import loginService from "../../services/auth/loginService.js";
import logger from '../../utilities/logger.js';
import { sharedErrors } from '@dungeon-ledger/shared';

 
async function loginController(req: Request, res: Response) {
    try {

        //get the user agent for session tracking
        const userAgent = req.headers["user-agent"] || "";

        //get the ip address from the request
        const ip = req.ip || "";

        //attempt to login the user
        const result = await loginService({
            email: req.body.email,
            password: req.body.password,
            session: { 
                userAgent: userAgent,
                ipAddress: ip,
            },
        });

        //if login failed
        if (!result.success) {
            return res.status(200).json({ error: sharedErrors.LOGIN_FAILED }); 
        }

        //login successful get tokens
        const { accessToken, refreshToken, sessionID } = result.data;

        //set the refresh token cookie
        res.cookie("refreshToken", { refreshToken, lookupID: sessionID }, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/auth",
            maxAge: 1000 * 60 * 60 * 24 * AppConfig.Token_TTL_Days,
        }); 

        //return the access token
        return res.status(200).json({
            accessToken: accessToken,
        });

    } catch (error) {

        logger.error({ err: error }, "Error logging in user");
        return res.status(500).end();
    }
}

export default loginController; 