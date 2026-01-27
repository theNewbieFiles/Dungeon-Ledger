// middleware/requestLogger.js
import { randomUUID } from "crypto";
import logger from "../utilities/logger.js";

export function requestLogger(req, res, next) {
    const requestId = randomUUID();
    req.requestId = requestId;

    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;

        logger.info({
            requestId,
            method: req.method,
            path: req.originalUrl,
            status: res.statusCode,
            duration,
        }, "Request completed");
    });

    next();
}
