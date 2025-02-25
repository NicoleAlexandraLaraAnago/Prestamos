const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');

let verificationCode = '';

router.post('/send-code', async (req, res) => {
    const { email } = req.body;
    verificationCode = crypto.randomBytes(3).toString('hex'); // Genera un código de 6 caracteres

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Código de verificación',
        html: `
            <p>Tu código de verificación es: ${verificationCode}</p>
            <a href="http://localhost:3000/verification?code=${verificationCode}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;">Aceptar</a>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Código enviado');
    } catch (error) {
        res.status(500).send('Error al enviar el correo');
    }
});

router.post('/verify-code', (req, res) => {
    const { code } = req.body;
    if (code === verificationCode) {
        res.status(200).send('Código verificado');
    } else {
        res.status(400).send('Código incorrecto');
    }
});

module.exports = router;