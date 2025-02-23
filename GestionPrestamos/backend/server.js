require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const usuarioRoutes = require("./routes/usuarioRoutes"); // Asegúrate de que esta línea esté presente

// Configurar Express
const app = express();
app.use(cors({
  origin: "http://localhost:3000", // Reemplaza con la URL de tu frontend si es otra
  credentials: true,
}));

app.use(express.json()); // <-- Esto debe estar antes de definir las rutas
app.use(express.urlencoded({ extended: true })); // <-- Para manejar formularios también
// Agregar el middleware para hacer un log de las rutas de usuario
app.use("/api/usuarios", (req, res, next) => {
  console.log("Ruta '/api/usuarios' recibida", req.method);
  next();
});

// Usar las rutas de usuario
app.use("/api/usuarios", usuarioRoutes); // Aquí estamos asegurándonos de que las rutas estén disponibles bajo '/api/usuarios'

// Conectar a la base de datos
db.sync()
  .then(() => console.log("📂 Base de datos sincronizada"))
  .catch((error) => console.error("❌ Error en la sincronización:", error));

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("🚀 Servidor Prestamos corriendo...");
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
