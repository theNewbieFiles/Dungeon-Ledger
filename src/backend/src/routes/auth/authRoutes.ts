import { Router } from "express";
import loginController from "../../controllers/auth/loginController.js";
import logoutController from "../../controllers/auth/logoutController.js";
import { accessTokenRefreshController } from "../../controllers/auth/accessTokenRefreshController.js";

const router = Router();

/**
 * log the user in
 * POST /login
 * Body: { email, password }
 */
router.post("/login", loginController);

/**
 * Refresh the access token using the refresh token cookie
 * POST /refresh
 */
router.post("/refresh", accessTokenRefreshController);


/**
 * Log the user out
 * POST /logoff
 */
router.post("/logoff", logoutController); 


export default router;
