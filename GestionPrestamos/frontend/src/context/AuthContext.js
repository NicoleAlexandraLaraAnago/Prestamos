// /src/context/AuthContext.js
import React, { createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);

  // Modificación en el login: ahora también se pasa el mfaSecret
  const login = async (username, password, mfaCode = '', mfaSecret = '') => {
    try {
      const response = await axios.post('http://localhost:5000/api/usuarios/login', {
        correo: username,
        contrasena: password,
        codigo_mfa: mfaCode, // Enviar MFA code si es requerido
        secret_mfa: mfaSecret, // Enviar el MFA secret cuando es necesario
      });

      if (response.data.success) {
        setAuthData(response.data); // Guardar datos del usuario (como token, etc.)
        return { success: true, mfaRequired: response.data.mfaRequired }; // Devolver si MFA es requerido
      } else {
        return { success: false, mensaje: response.data.mensaje };
      }
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, mensaje: 'Error en el servidor' };
    }
  };

  return (
    <AuthContext.Provider value={{ authData, login }}>
      {children}
    </AuthContext.Provider>
  );
};
