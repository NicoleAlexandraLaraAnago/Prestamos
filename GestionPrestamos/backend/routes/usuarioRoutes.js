const express = require("express");
const { registrarUsuario, ingresar } = require("../controllers/usuarioController"); // Importar ambas funciones
const { solicitarRecuperacion, restablecerContrasena } = require('../controllers/usuarioController');
const { activarMFA, verificarMFA } = require('../controllers/usuarioController');

const router = express.Router();

// Ruta para registrar usuario
router.post("/registro", registrarUsuario);

// Ruta para login de usuario
router.post("/login", ingresar);
router.post('/recuperar', solicitarRecuperacion);
router.post('/restablecer', restablecerContrasena);
router.post('/activar-mfa', activarMFA);
router.post('/verificar-mfa', verificarMFA);
module.exports = router;
