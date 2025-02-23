const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Usuario = sequelize.define(
  "Usuario",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre_completo: { type: DataTypes.STRING, allowNull: false },
    identificacion: { type: DataTypes.STRING(20), allowNull: false, unique: true },
    fecha_nacimiento: { type: DataTypes.DATE, allowNull: false },
    direccion: { type: DataTypes.TEXT, allowNull: true },
    correo: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    contrasena: { type: DataTypes.STRING, allowNull: false }, // Se almacenará con bcrypt
    sueldo: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    carga_familiar: { type: DataTypes.INTEGER, allowNull: false },
    historial_crediticio: { type: DataTypes.ENUM("BUENO", "REGULAR", "MALO"), allowNull: false },
    rol: { type: DataTypes.ENUM("ADMIN", "USUARIO"), defaultValue: "USUARIO" },
    fecha_registro: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "usuarios", // Nombre real de la tabla
    timestamps: false, // Evitar que Sequelize agregue createdAt y updatedAt
  }
);

module.exports = Usuario;
