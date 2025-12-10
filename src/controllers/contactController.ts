import { Request, Response } from 'express';
import { contactSchema, ContactFormData, sanitizeContactData } from '../utils/validation';
import { z } from 'zod';
import { sendContactEmail as sendEmail } from '../services/emailService';
import { logger } from '../config/logger';


export const sendContactEmail = async (req: Request, res: Response) => {
    try {
        const validatedData : ContactFormData = contactSchema.parse(req.body); 
        const sanitizedData = sanitizeContactData(validatedData);

        await sendEmail(sanitizedData);
        logger.info('Contact form email sent successfully.');

        res.status(200).json({
            success: true,
            message: 'Email sent successfully'
        });
    } catch (error) {
        // Handle Zod validation errors
        if (error instanceof z.ZodError) {
            logger.warn({ err: error }, 'Validation failed');
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.issues.map((issue) => ({
                    field: issue.path.join('.'),
                    message: issue.message
                }))
            });
        }

        // Handle other errors
        logger.error({ err: error }, 'Failed to send contact email');
        res.status(500).json({
            success: false,
            message: 'Failed to send email'
        });
    }
}
