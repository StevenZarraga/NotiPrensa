// frontend/src/context/AuthContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// 1. Creamos el contexto
const AuthContext = createContext(null);

// 2. Creamos el "Proveedor" del contexto. Este componente envolverá nuestra aplicación.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  // 3. useEffect para cargar el usuario si ya existe un token en localStorage (al recargar la página)
  useEffect(() => {
    if (token) {
      // Guardamos el token en los headers de axios para todas las futuras peticiones
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Aquí podríamos ir a buscar los datos del usuario a un endpoint /api/auth/me
      // Por ahora, para simplificar, decodificaremos el token para obtener el username
      const decoded = JSON.parse(atob(token.split('.')[1])); // Decodificación simple
      setUser({ username: decoded.username, id: decoded.id });
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    }
  }, [token]);

  // 4. Función de Login: guarda el token y actualiza el estado
  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  // 5. Función de Logout: borra el token y el estado
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  // 6. El valor que proveeremos a todos los componentes hijos
  const value = {
    user,
    token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 7. Creamos un hook personalizado para usar nuestro contexto más fácilmente
export const useAuth = () => {
  return useContext(AuthContext);
};