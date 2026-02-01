import logoutService from "../../services/auth/logoutService.js";
import type { Request, Response } from 'express';
import logger from "../../utilities/logger.js";
import { lookup } from "node:dns";

async function logoutController(req: Request, res: Response) {
    try {

        //get the refresh token cookie
        const cookie = req.cookies.refreshToken;

        //check cookie signature
        if (!cookie || !cookie.lookupID || !cookie.refreshToken) {
            logger.info({}, "No valid refresh token cookie found during logout");
            clearCookie(res);
            return res.status(401).end();
        }

        //attempt to invalidate the token.
        const response = await logoutService(cookie.lookupID, cookie.refreshToken);

        if (!response.success) {
            clearCookie(res);
            logger.error({lookup: cookie.lookupID}, "Failed to logout user");
            return res.status(401).end();
        }

        //delete cookie
        clearCookie(res);

        //logout successful
        return res.sendStatus(204);


    } catch (error) {
        logger.error({ err: error }, "Error logging out user");
        clearCookie(res);
        return res.status(500).end();
    }
};

function clearCookie(res: Response) {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/auth",
    });
}



export default logoutController; 