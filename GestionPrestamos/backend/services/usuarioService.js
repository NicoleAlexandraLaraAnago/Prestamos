// /services/usuarioService.js
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');

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

const generarTokenRecuperacion = (usuario) => {
  const payload = { id: usuario.id, correo: usuario.correo };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const sendRecoveryEmail = async (correo) => {
  const usuario = await Usuario.findOne({ where: { correo } });
  if (!usuario) return false;

  const token = generarTokenRecuperacion(usuario);
  // Aquí enviarías el correo con el enlace de recuperación
  return true;
};

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

const generarSecretoMFA = (usuario) => {
  const secreto = speakeasy.generateSecret({ length: 20 });
  usuario.mfa_secret = secreto.base32; // Guardar el secreto en la base de datos
  usuario.save();
  return secreto.otpauth_url; // URL para configurar Google Authenticator
};

const verificarCodigoMFA = (usuario, codigo) => {
  return speakeasy.totp.verify({
    secret: usuario.mfa_secret,
    encoding: 'base32',
    token: codigo,
  });
};

// Exportar todas las funciones juntas
module.exports = {
  autenticarUsuario,
  sendRecoveryEmail,
  resetearContrasena,
  generarSecretoMFA,
  verificarCodigoMFA,
};
