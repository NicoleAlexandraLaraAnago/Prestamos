const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const usuarioService = require("../services/usuarioService"); // Importar el servicio de usuarios
const { generarTokenJWT } = require("../utils/tokenUtils"); // Importar la función para generar el JWT

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
  
  console.log("Intento de login con:", correo);
  console.log("Cuerpo recibido:", req.body); 
  // Validación de datos de login
  if (!correo || !contrasena) {
    return res.status(400).json({ mensaje: 'Correo y contraseña son obligatorios' });
  }

  try {
    const usuario = await usuarioService.autenticarUsuario(correo, contrasena);

    if (!usuario) {
      console.log("Autenticación fallida: Credenciales incorrectas");
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    console.log("Usuario autenticado:", usuario.id);

    const token = generarTokenJWT(usuario);
    console.log("Token generado:", token);

    res.status(200).json({ mensaje: 'Login exitoso', token });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ mensaje: "Error en el servidor", error: error.message });
  }
};

// Recuperación de contraseña
const { sendRecoveryEmail } = require('../services/usuarioService');
exports.solicitarRecuperacion = async (req, res) => {
  const { correo } = req.body;

  if (!correo) {
    return res.status(400).json({ mensaje: 'Correo es obligatorio' });
  }

  try {
    const result = await sendRecoveryEmail(correo);
    if (!result) {
      return res.status(404).json({ mensaje: 'Correo no encontrado' });
    }
    res.status(200).json({ mensaje: 'Enlace de recuperación enviado al correo' });
  } catch (error) {
    console.error('Error en solicitud de recuperación:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Restablecimiento de contraseña
const { resetearContrasena } = require('../services/usuarioService');
exports.restablecerContrasena = async (req, res) => {
  const { token, nueva_contrasena } = req.body;

  if (!token || !nueva_contrasena) {
    return res.status(400).json({ mensaje: 'Faltan datos para restablecer la contraseña' });
  }

  try {
    const result = await resetearContrasena(token, nueva_contrasena);
    if (!result) {
      return res.status(400).json({ mensaje: 'Token inválido o expirado' });
    }
    res.status(200).json({ mensaje: 'Contraseña restablecida con éxito' });
  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// Activación de MFA
const { generarSecretoMFA } = require('../services/usuarioService');
exports.activarMFA = async (req, res) => {
  const usuario = req.usuario; // Obtén el usuario autenticado

  try {
    const url = generarSecretoMFA(usuario);
    res.status(200).json({ mensaje: 'MFA activado', url });
  } catch (error) {
    console.error('Error al activar MFA:', error);
    res.status(500).json({ mensaje: 'Error al activar MFA' });
  }
};

// Verificación de MFA
const { verificarCodigoMFA } = require('../services/usuarioService');
exports.verificarMFA = async (req, res) => {
  const { codigo } = req.body;

  if (!codigo) {
    return res.status(400).json({ mensaje: 'Código MFA es obligatorio' });
  }

  try {
    const usuario = req.usuario; // Usuario autenticado

    const esValido = verificarCodigoMFA(usuario, codigo);
    if (!esValido) {
      return res.status(401).json({ mensaje: 'Código MFA incorrecto' });
    }

    res.status(200).json({ mensaje: 'Autenticación exitosa' });
  } catch (error) {
    console.error('Error al verificar MFA:', error);
    res.status(500).json({ mensaje: 'Error al verificar MFA' });
  }
};
