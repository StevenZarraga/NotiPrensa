import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registrationKey, setRegistrationKey] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRegKey, setShowRegKey] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(`${API_BASE_URL}/api/auth/register`, {
        username,
        password,
        registrationKey,
      });
      alert('¡Usuario registrado exitosamente! Ahora puedes iniciar sesión.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar el usuario.');
    }
  };

  return (
    <div className="flex items-center justify-center mt-20">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Registrar Nuevo Administrador</h1>
        <h3 className="text-center font-style: italic">Sólo Personal DORCI-Prensa</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="text-sm font-medium text-gray-700">Usuario</label>
            <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="block w-full px-3 py-2 mt-1 border rounded-md" />
          </div>
          <div>
            <label htmlFor="password"  className="text-sm font-medium text-gray-700">Contraseña (mínimo 6 caracteres)</label>
            <div className="relative">
              <input 
                id="password" 
                type={showPassword ? 'text' : 'password'}
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="block w-full px-3 py-2 mt-1 border rounded-md" 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600">
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="registrationKey" className="text-sm font-medium text-gray-700">Clave Jefe de Prensa</label>
            <div className="relative">
              <input
                id="registrationKey"
                type={showRegKey ? 'text' : 'password'}
                value={registrationKey}
                onChange={(e) => setRegistrationKey(e.target.value)}
                required
                className="block w-full px-3 py-2 mt-1 border rounded-md"
              />
              <button type="button" onClick={() => setShowRegKey(!showRegKey)} className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600">
                {showRegKey ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-center text-red-500">{error}</p>}
          <div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border rounded-md text-white bg-green-700 hover:bg-emerald-900">
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}