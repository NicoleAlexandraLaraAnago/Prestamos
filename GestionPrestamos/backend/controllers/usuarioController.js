// /controllers/usuarioController.js
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');  // Asegúrate de importar nodemailer
require('dotenv').config();
const usuarioService = require('../services/usuarioService');  // Importar el servicio de usuarios
const { generarTokenJWT } = require('../utils/tokenUtils');  // Importar la función para generar el JWT

// Registro de usuario
exports.registrarUsuario = async (req, res) => {
  try {
    const { nombre_completo, identificacion, fecha_nacimiento, direccion, correo, contrasena, sueldo, carga_familiar, historial_crediticio, rol } = req.body;

    // Validación de datos
    if (!correo || !contrasena || !nombre_completo) {
      return res.status(400).json({ success: false, mensaje: "Faltan datos obligatorios" });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Crear usuario en la base de datos
    const usuario = await Usuario.create({
      nombre_completo,
      identificacion,
      fecha_nacimiento,
      direccion,
      correo,
      contrasena: hashedPassword,
      sueldo,
      carga_familiar,
      historial_crediticio,
      rol,
    });

    res.status(201).json({ 
      success: true, 
      mensaje: "Usuario registrado con éxito", 
      usuario 
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ 
      success: false, 
      mensaje: "Error en el servidor", 
      error: error.message 
    });
  }
};

// Login de usuario
exports.ingresar = async (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ mensaje: 'Correo y contraseña son obligatorios' });
  }

  try {
    // Intentar autenticar usuario
    const usuario = await usuarioService.autenticarUsuario(correo, contrasena); // Asegúrate de que esta línea esté dentro de la función async

    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    const token = generarTokenJWT(usuario);

    if (!usuario.mfa_secret) {
      // Generar URL de MFA
      const url = await usuarioService.generarSecretoMFA(usuario);

      // Aquí creas el transporter para el envío del correo
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: usuario.correo,
        subject: 'Configura tu MFA',
        text: `Para activar el MFA, escanea el siguiente código QR con Google Authenticator: ${url}`,
      };

      // Envío del correo
      await transporter.sendMail(mailOptions); // Asegúrate de que esto esté dentro de la función async
    }

    res.status(200).json({ mensaje: 'Revisa tu correo', token });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ mensaje: "Error en el servidor", error: error.message });
  }
};

// Recuperación de contraseña
exports.solicitarRecuperacion = async (req, res) => {
  const { correo } = req.body;

  if (!correo) {
    return res.status(400).json({ mensaje: 'Correo es obligatorio' });
  }

  try {
    const result = await usuarioService.sendRecoveryEmail(correo);
    if (!result) {
      return res.status(404).json({ mensaje: 'Correo no encontrado' });
    }
    res.status(200).json({ mensaje: 'Enlace de recuperación enviado al correo' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Restablecimiento de contraseña
exports.restablecerContrasena = async (req, res) => {
  const { token, nueva_contrasena } = req.body;

  if (!token || !nueva_contrasena) {
    return res.status(400).json({ mensaje: 'Faltan datos para restablecer la contraseña' });
  }

  try {
    const result = await usuarioService.resetearContrasena(token, nueva_contrasena);
    if (!result) {
      return res.status(400).json({ mensaje: 'Token inválido o expirado' });
    }
    res.status(200).json({ mensaje: 'Contraseña restablecida con éxito' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Activación de MFA
exports.activarMFA = async (req, res) => {
  const usuario = req.usuario; // Obtén el usuario autenticado

  try {
    const url = await usuarioService.generarSecretoMFA(usuario);
    res.status(200).json({ mensaje: 'MFA activado', url });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al activar MFA' });
  }
};

// Verificación de MFA
exports.verificarMFA = async (req, res) => {
  const { codigo } = req.body;

  if (!codigo) {
    return res.status(400).json({ mensaje: 'Código MFA es obligatorio' });
  }

  try {
    const usuario = req.usuario; // Usuario autenticado

    const esValido = await usuarioService.verificarCodigoMFA(usuario, codigo);
    if (!esValido) {
      return res.status(401).json({ mensaje: 'Código MFA incorrecto' });
    }

    res.status(200).json({ mensaje: 'Autenticación exitosa' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al verificar MFA' });
  }
};
