import dotenv from "dotenv";

dotenv.config();

export const config = {
    port: process.env.PORT || 4000,
    nodeEnv: process.env.NODE_ENV || "development",

    cors: {
        allowedOrigins: process.env.ALLOWED_ORIGINS
            ? process.env.ALLOWED_ORIGINS.split(",")
            : ["https://ghivalla.com", "http://dev.ghivalla.com"],
    },

    // Email configuration
    email: {
        from: process.env.EMAIL_FROM || "ghivalla@ghivalla.com",
        to: process.env.EMAIL_TO || "ghivalla@gmail.com", // Your receiving email
    },

    // Resend API configuration
    resend: {
        apiKey: process.env.RESEND_API_KEY || "",
    },

    // Rate limiting ( 5 requests per 15 minutes)
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"),
        maxRequests: parseInt(process.env.RATELIMIT_MAX_REQUESTS || "5"), 
    }

} as const;
