// /services/usuarioService.js
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const nodemailer = require('nodemailer');

// Función para autenticar usuario
const autenticarUsuario = async (correo, contrasena) => {
  console.log("Buscando usuario con correo:", correo);

  const usuario = await Usuario.findOne({ where: { correo } });

  if (!usuario) {
    console.log("Usuario no encontrado");
    return null;
  }

  console.log("Usuario encontrado:", usuario);

  const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

  if (!contrasenaValida) {
    console.log("Contraseña incorrecta");
    return null;
  }

  console.log("Contraseña correcta, autenticando usuario...");
  return usuario;
};

// Generación del token de recuperación
const generarTokenRecuperacion = (usuario) => {
  const payload = { id: usuario.id, correo: usuario.correo };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Enviar correo de recuperación
const sendRecoveryEmail = async (correo) => {
  const usuario = await Usuario.findOne({ where: { correo } });
  if (!usuario) return false;

  const token = generarTokenRecuperacion(usuario);
  
  // Configuración del correo
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: correo,
    subject: 'Recuperación de Contraseña',
    text: `Haga clic en el siguiente enlace para recuperar su contraseña: ${process.env.BASE_URL}/reset-password?token=${token}`,
  };

  // Enviar correo
  await transporter.sendMail(mailOptions);
  return true;
};

// Restablecer la contraseña
const resetearContrasena = async (token, nueva_contrasena) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findByPk(decoded.id);

    if (!usuario) return false;

    const hashedPassword = await bcrypt.hash(nueva_contrasena, 10);
    usuario.contrasena = hashedPassword;
    await usuario.save();

    return true;
  } catch (error) {
    return false;
  }
};

// Generar el secreto para MFA
const generarSecretoMFA = (usuario) => {
  const secreto = speakeasy.generateSecret({ length: 20 });
  usuario.mfa_secret = secreto.base32; // Guardar el secreto en la base de datos
  usuario.save();
  return secreto.otpauth_url; // URL para configurar Google Authenticator
};

// Verificar el código MFA
const verificarCodigoMFA = (usuario, codigo) => {
  return speakeasy.totp.verify({
    secret: usuario.mfa_secret,
    encoding: 'base32',
    token: codigo,
  });
};

module.exports = {
  autenticarUsuario,
  sendRecoveryEmail,
  resetearContrasena,
  generarSecretoMFA,
  verificarCodigoMFA,
};
