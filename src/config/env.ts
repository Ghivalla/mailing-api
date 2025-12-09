import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',

    // Email configuration
    email: {
      from: process.env.EMAIL_FROM || 'noreply@ghivalla.com',
      to: process.env.EMAIL_TO || 'ghivalla@gmail.com', // Your receiving email
    },

    // SMTP configuration (optional in development, Ethereal will be used as fallback)
    smtp: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    }
} as const;
