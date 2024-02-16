import { Global, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';


@Injectable()
@Global()
export class EmailService {

    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.elasticemail.com', // e.g., 'Gmail'
            port: 2525,
            auth: {
                user: 'ariannexux0101@gmail.com',
                pass: 'E3D264FC7490CD5C7A41182062C6C459D84C',
            },
        });
    }

    async sendMail(to: string, subject: string, text: string) {
        const mailOptions = {
            from: 'ariannexux0101@gmail.com',
            to,
            subject,
            text,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
            return true;
        } catch (error) {
            console.error('Error sending email:', error);
            return false;
        }
    }
}
