import rateLimit from 'express-rate-limit';
import { config } from '../config/env';

export const contactRateLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    message: { success: false, message : 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => config.nodeEnv === 'test'
});
