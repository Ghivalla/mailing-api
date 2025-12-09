import {z} from "zod"

export const contactSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters'),
    email: z.string()
        .email('Invalid email address')
        .max(254, 'Email must not exceed 254 characters'),
    message: z.string()
        .min(10, 'Message must be at least 10 characters')
        .max(5000, 'Message must not exceed 5000 characters')
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const sanitizeContactData = (data: ContactFormData): ContactFormData => {
    return {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        message: data.message.trim()
    };
};
