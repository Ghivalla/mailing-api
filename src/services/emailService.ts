import { Resend } from "resend";
import { config } from "../config/env";
import type { ContactFormData } from "../utils/validation";
import { logger } from "../config/logger";

// Initialize Resend client
const resend = new Resend(config.resend.apiKey);

// Send contact form email
export const sendContactEmail = async (
    data: ContactFormData,
): Promise<void> => {
    try {
        const result = await resend.emails.send({
            from: config.email.from,
            to: config.email.to,
            subject: `New contact form submission from ${data.name}`,
            text: `
You received a new message from your portfolio contact form:
Name: ${data.name}
Email: ${data.email}

Message:
${data.message}`.trim(),
            html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, "<br>")}</p>
      `.trim(),
        });

        if (result.error) {
            logger.error({ error: result.error }, 'Failed to send email via Resend');
            throw new Error(`Resend API error: ${result.error.message}`);
        }

        logger.info({
            messageId: result.data?.id,
            environment: config.nodeEnv
        }, 'Email sent successfully via Resend');
    } catch (error) {
        logger.error({ err: error }, 'Error sending email');
        throw error;
    }
};
