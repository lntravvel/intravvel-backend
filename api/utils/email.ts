import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn('Email credentials not configured');
            return false;
        }

        await transporter.sendMail({
            from: `"Intravvel" <${process.env.EMAIL_USER}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
        });

        return true;
    } catch (error) {
        console.error('Email sending error:', error);
        return false;
    }
};

export const sendContactNotification = async (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
}): Promise<boolean> => {
    const html = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Subject:</strong> ${data.subject}</p>
    <p><strong>Message:</strong></p>
    <p>${data.message}</p>
  `;

    return sendEmail({
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER || '',
        subject: `New Contact: ${data.subject}`,
        html,
    });
};
