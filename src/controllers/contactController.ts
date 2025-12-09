import { Request, Response } from 'express';
import { contactSchema, ContactFormData, sanitizeContactData } from '../utils/validation';
import { z } from 'zod';


export const sendContactEmail = async (req: Request, res: Response) => {
    try {
        const validatedData : ContactFormData = contactSchema.parse(req.body); 
        const sanitizedData = sanitizeContactData(validatedData);

        // Email sending will go here
        console.log('validated contact form:', sanitizedData);

        const { name, email, message } = req.body;
        
        console.log(`Contact form submitted by ${name} (${email}): ${message}`);

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
