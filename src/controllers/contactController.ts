import { Request, Response } from 'express';
import { contactSchema, ContactFormData, sanitizeContactData } from '../utils/validation';
import { z } from 'zod';
import { sendContactEmail as sendEmail } from '../services/emailService';


export const sendContactEmail = async (req: Request, res: Response) => {
    try {
        const validatedData : ContactFormData = contactSchema.parse(req.body); 
        const sanitizedData = sanitizeContactData(validatedData);

        await sendEmail(sanitizedData);
        console.log('Contact form email sent successfully.');

        res.status(200).json({
            success: true,
            message: 'Email sent successfully'
        });
    } catch (error) {
        console.error('Error sending contact email:', error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.issues.map(e => ({ field: e.path.join('.'), message: e.message }))
            });
        }
        console.error('Error in sendContactEmail:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send email'
        });
    }
}
