// frontend/src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { token } = useAuth(); // Usamos el token como la fuente de verdad

  // Si no hay token, redirigimos al usuario a la página de login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si hay un token, renderizamos la página que el usuario quería ver
  // El componente <Outlet> actúa como un placeholder para la ruta hija
  return <Outlet />;
};

export default ProtectedRoute;