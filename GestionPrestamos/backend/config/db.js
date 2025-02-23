const { Sequelize } = require("sequelize");
require("dotenv").config();

// Configuración de Sequelize para MySQL
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false, // Para evitar logs innecesarios en la consola
  }
);

// Probar la conexión
sequelize
  .authenticate()
  .then(() => console.log("✅ Conectado a la base de datos MySQL"))
  .catch((error) => console.error("❌ Error al conectar la BD:", error));

module.exports = sequelize;
