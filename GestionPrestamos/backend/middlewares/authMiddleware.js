const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ mensaje: "Acceso denegado. No hay token." });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.usuario = decoded;
    next();
  } catch (error) {
    res.status(400).json({ mensaje: "Token no válido." });
  }
};
