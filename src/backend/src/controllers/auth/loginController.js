import AppConfig from "../../config/appConfig.js";
import loginService from "../../services/auth/loginService.js";
import { mapErrorToStatus } from "../../utilities/mapErrorToStatus.js";


async function loginController(req, res) {
    try {

        //get the user agent for session tracking
        const userAgent = req.headers["user-agent"] || "";

        //get the ip address from the request
        const ip = req.ip;

        const result = await loginService({
            email: req.body.email,
            password: req.body.password,
            session: {
                userAgent: userAgent,
                ipAddress: ip,
            },
        });

        if (!result.success) {
            return res
                .status(mapErrorToStatus(result.error))
                .json({ error: result.error.message });
        }

        const { accessToken, refreshToken } = result.data;

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/auth",
            maxAge: 1000 * 60 * 60 * 24 * AppConfig.Token_TTL_Days,
        });

        return res.status(200).json({
            accessToken: accessToken,
        });

    } catch (err) {

        if (err.code === "INVALID_CREDENTIALS") {
            return res.status(401).json({
                error: "Invalid email or password",
            });
        }

        console.error("Login error:", err);
        return res.status(500).json({
            error: "Internal server error",
        });
    }
}

export default loginController;