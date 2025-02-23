// /server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const usuarioRoutes = require('./routes/usuarioRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/usuarios', usuarioRoutes);

app.listen(5000, () => {
  console.log('Servidor corriendo en http://localhost:5000');
});
