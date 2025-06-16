// frontend/src/pages/LoginPage.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { login } = useAuth();

  // 1. AÑADIMOS EL ESTADO PARA LA VISIBILIDAD DE LA CONTRASEÑA
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
      });
      login(response.data.token);
      
      alert('¡Inicio de sesión exitoso!');
      navigate('/admin');

    } catch (err) {
      setError('Nombre de usuario o contraseña incorrectos.');
    }
  };

  return (
    <div className="flex items-center justify-center mt-20">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Iniciar Sesión</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="text-sm font-medium text-gray-700">Usuario</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="password"  className="text-sm font-medium text-gray-700">Contraseña</label>
            {/* 2. ENVOLVEMOS EL INPUT Y EL BOTÓN PARA POSICIONARLOS */}
            <div className="relative">
              <input
                id="password"
                // 3. EL TIPO DEL INPUT AHORA ES DINÁMICO
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
              />
              {/* 4. AÑADIMOS EL BOTÓN DE TOGGLE */}
              <button
                type="button" // Importante para que el botón no envíe el formulario
                onClick={() => setShowPassword(!showPassword)} // Cambia el estado de true a false
                className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600"
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>
          
          {error && <p className="text-sm text-center text-red-500">{error}</p>}
          
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}