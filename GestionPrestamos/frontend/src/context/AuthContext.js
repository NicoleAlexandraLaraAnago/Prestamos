import React, { createContext, useState, useEffect } from "react";
import { loginUser } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const login = async (username, password) => {
    const userData = await loginUser(username, password);
    if (userData.success) {  // Corrección aquí
      setUser(userData.usuario);
    }
    return userData; // Para que Login.js pueda manejar la respuesta
  };
  

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
