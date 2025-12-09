import dotenv from "dotenv";

dotenv.config();

export const config = {
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || "development",

    cors: {
        allowedOrigins: process.env.ALLOWED_ORIGINS
            ? process.env.ALLOWED_ORIGINS.split(",")
            : ["http://localhost:3000", "http://localhost:3001"],
    },

    // Email configuration
    email: {
        from: process.env.EMAIL_FROM || "noreply@ghivalla.com",
        to: process.env.EMAIL_TO || "ghivalla@gmail.com", // Your receiving email
    },

    // SMTP configuration (optional in development, Ethereal will be used as fallback)
    smtp: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },

    // Rate limiting ( 5 requests per 15 minutes)
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"),
        maxRequests: parseInt(process.env.RATELIMIT_MAX_REQUESTS || "5"), 
    }

} as const;
