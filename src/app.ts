import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config/env";
import contactRoutes from "./routes/contactRoutes";
import { httpLogger } from "./middleware/logger";

const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (config.cors.allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    }),
);

// HTTP request logger
app.use(httpLogger);

// limit body request to 15kb
app.use(express.json({ limit: '15kb' }));


// Health Check
app.get("/health", (req, res) => {
    res.json({ status: "OK" });
});

app.use("/", contactRoutes);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Global Error handler:', err.message);

    // CORS errors
    if (err.message === "Not allowed by CORS") {
        return res.status(403).json({
            success: false,
            message: "CORS Error: This origin is not allowed.",
        });
    }

    // Generic error;
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

export default app;
