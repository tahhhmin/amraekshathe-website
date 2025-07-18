import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface EmailData {
  to: string;
  [key: string]: string; // For placeholders in template
}

/**
 * Send an email using a specified template and data replacements
 * @param type - Template name (e.g., 'contactMessageVerify')
 * @param data - Data object with 'to' and any placeholders for template replacement
 */
export async function sendEmail(type: string, data: EmailData): Promise<void> {
    try {
        // Update template path to src/mails
        const templatePath = path.join(__dirname, '..', 'mails', `${type}.html`);

        if (!fs.existsSync(templatePath)) {
        throw new Error(`Email template "${type}" not found at ${templatePath}`);
        }

        let html = fs.readFileSync(templatePath, 'utf8');

        // Extract <title> as subject
        const titleMatch = html.match(/<title>(.*?)<\/title>/i);
        const subject = titleMatch ? titleMatch[1].trim() : 'No Subject';

        // Replace placeholders like {{code}}, {{name}}, etc.
        Object.entries(data).forEach(([key, value]) => {
        const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
        html = html.replace(regex, value);
        });

        const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        });

        const mailOptions = {
        from: `"Hashi Ekshathe" <${process.env.SMTP_USER}>`,
        to: data.to,
        subject,
        html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email "${type}" sent to ${data.to}: ${info.messageId}`);

    } catch (error: unknown) {
        if (error instanceof Error) {
        console.error(`Failed to send email (${type}) to ${data.to}:`, error.message);
        throw new Error('Failed to send email');
        } else {
        console.error(`Failed to send email (${type}) to ${data.to}:`, error);
        throw new Error('Failed to send email');
        }
    }
}
