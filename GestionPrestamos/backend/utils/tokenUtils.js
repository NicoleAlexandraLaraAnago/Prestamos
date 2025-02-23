// /utils/tokenUtils.js
const jwt = require('jsonwebtoken');

const generarTokenJWT = (usuario) => {
  const payload = {
    id: usuario.id,
    correo: usuario.correo,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = { generarTokenJWT };
