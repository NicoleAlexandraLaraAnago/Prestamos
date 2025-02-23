require("dotenv").config(); // Asegúrate de que dotenv esté cargado

console.log("JWT_SECRET:", process.env.JWT_SECRET); // <-- Esto imprimirá el secreto

const jwt = require("jsonwebtoken");

const generarTokenJWT = (usuario) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("Falta JWT_SECRET en el archivo .env");
  }

  return jwt.sign({ id: usuario.id, correo: usuario.correo }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

module.exports = { generarTokenJWT };
