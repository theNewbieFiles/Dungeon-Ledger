import { Router } from "express";
import { mapErrorToStatus } from "../utilities/mapErrorToStatus.js";
import { login } from "../services/auth.service.js";

const router = Router();

/**
 * POST /login
 * Body: { email, password }
 */
router.post("/login", async (req, res) => {
    try {

        const result = await login(req.body);

        if (!result.success) {
            return res
                .status(mapErrorToStatus(result.error))
                .json({ error: result.error.message });
        }

        return res.status(200).json(result.data);
    } catch (err) {
        // Centralized error shape later; simple for now
        if (err.code === "INVALID_CREDENTIALS") {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        console.error("Login error:", err);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
});

export default router;
