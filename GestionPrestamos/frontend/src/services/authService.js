import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/usuarios/registro`, userData);
    return response.data;
  } catch (error) {
    console.error("Error en registro:", error);
    return { success: false, mensaje: error.response?.data?.mensaje || "No se recibió respuesta del servidor" };
  }
};

export const loginUser = async (correo, contrasena) => {
  try {
    const response = await axios.post(`${API_URL}/usuarios/login`, { correo, contrasena }, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error en login:", error);
    return {
      success: false,
      mensaje: error.response?.data?.mensaje || "Error al iniciar sesión"
    };
  }
};

