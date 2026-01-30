import { Router } from "express";
import loginController from "../../controllers/auth/loginController.js";
import logoutController from "../../controllers/auth/logoutController.js";

const router = Router();

/**
 * POST /login
 * Body: { email, password }
 */
router.post("/login", loginController);

router.post("/refresh", (req, res) => {
    const token = req.cookies.refreshToken;

    if (!token) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    // validate token, rotate if desired
});



router.post("/logoff", logoutController); 


export default router;
