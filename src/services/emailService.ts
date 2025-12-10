import nodemailer from "nodemailer";
import { config } from "../config/env";
import type { ContactFormData } from "../utils/validation";
import { logger } from "../config/logger";

let transporter: nodemailer.Transporter | null = null;

// Initialize email transporter
// Uses Ethereal Email for testing if no SMTP credentials are provided
const createTransporter = async (): Promise<nodemailer.Transporter> => {

    // If SMTP credentials are provided, use them
    if (config.smtp.host && config.smtp.user && config.smtp.pass) {
        logger.info({ host: config.smtp.host }, 'Using configured SMTP server');
        return nodemailer.createTransport({
            host: config.smtp.host,
            port: config.smtp.port,
            secure: config.smtp.secure,
            auth: {
                user: config.smtp.user,
                pass: config.smtp.pass,
            },
        });
    }

    // Otherwise, create a test account with Ethereal
    logger.info('No SMTP configured, creating Ethereal test account');
    const testAccount = await nodemailer.createTestAccount();

    logger.info({ user: testAccount.user }, 'Ethereal test account created');

    return nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });
};

// Get or create the email transporter
const getTransporter = async (): Promise<nodemailer.Transporter> => {
    if (!transporter) {
        transporter = await createTransporter();
    }
    return transporter;
};

// Send contact form email
export const sendContactEmail = async (
    data: ContactFormData,
): Promise<void> => {
    const transport = await getTransporter();

    const mailOptions = {
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
    };

    const info = await transport.sendMail(mailOptions);

    // Log preview URL for Ethereal emails
    if (config.nodeEnv === "development") {
        const previewUrl = nodemailer.getTestMessageUrl(info);
        logger.info({
            messageId: info.messageId,
            previewUrl
        }, 'Email sent successfully');
    } else {
        logger.info({ messageId: info.messageId }, 'Email sent successfully');
    }
};
