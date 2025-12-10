import pinoHttp from "pino-http";
import { logger } from "../config/logger";

export const httpLogger = pinoHttp({
    logger,
    customLogLevel: (req, res, err) => {
        if (res.statusCode >= 400 && res.statusCode < 500) {
            return "warn";
        } else if (res.statusCode >= 500 || err) {
            return "error";
        }
        return "info";
    },
    customSuccessMessage: (req, res) => {
        return `${req.method} ${req.url} - ${res.statusCode}`;
    },
    customErrorMessage: (req, res, err) => {
        return `${req.method} ${req.url} - ${res.statusCode} - Error: ${err.message}`;
    },
    serializers: {
        req: (req) => ({
            method: req.method,
            url: req.url,
            headers: { 'user-agent': req.headers['user-agent']}
        }),
        res: (res) => ({
            statusCode: res.statusCode
        })
    }
});
