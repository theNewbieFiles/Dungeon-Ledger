import { Router } from "express";
import loginController from "../../controllers/auth/loginController.js";

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


export default router;
