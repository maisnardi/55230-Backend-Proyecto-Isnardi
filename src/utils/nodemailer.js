//Importación de módulos
import nodemailer from 'nodemailer'
import { ENV } from '../config/config.js';

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: ENV.EMAIL,
        pass: ENV.EMAILPASS
    }
});

export default transporter;