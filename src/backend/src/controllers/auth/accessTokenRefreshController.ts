import type { Request, Response } from 'express';
import { accessTokenRefreshService } from '../../services/auth/accessTokenRefreshService.js';
import type { RefreshCookie } from '../../utilities/types.js';
import logger from '../../utilities/logger.js';
import { sharedErrors } from '@dungeon-ledger/shared';

export async function accessTokenRefreshController(req: Request, res: Response) {
    const cookie: RefreshCookie = req.cookies.refreshToken;

    //check cookie signature
    if (!cookie || !cookie.lookupID || !cookie.refreshToken) {
        
        return res.status(401).json({ error: sharedErrors.REFRESH_TOKEN_INVALID });
    }

    try {
        const response = await accessTokenRefreshService(cookie.lookupID, cookie.refreshToken);

        if (!response.success) {
            return res.status(401).json({ error: sharedErrors.REFRESH_TOKEN_INVALID });
        }

        return res.status(200).json({ accessToken: response.data });


    } catch (error) {
        logger.error({ err: error }, "Error refreshing access token");
        return res.status(500).end();
    }
}   