const Prestamo = require("../models/Prestamo");

exports.validarNuevoPrestamo = async (usuarioId, monto) => {
  const prestamosActivos = await Prestamo.findOne({ where: { usuarioId, estado: "activo" } });
  if (prestamosActivos) throw new Error("No puedes solicitar un nuevo préstamo hasta pagar el actual.");
  if (monto < 100 || monto > 5000) throw new Error("El monto debe estar entre $100 y $5000.");
  return true;
};
