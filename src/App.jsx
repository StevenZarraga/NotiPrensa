import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

import HomePage from "./pages/HomePage.jsx";
import EditorPage from "./pages/EditorPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ArticleDetailPage from "./pages/ArticleDetailPage.jsx";
import Dropdown from './components/Dropdown.jsx';

export default function App() {
  const { user, logout } = useAuth();

  return (
    <Router>
      <header className="bg-green-600 py-2 shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4">
          <Link to="/">
            <img src="/logo-ofic-texto.png" alt="Logo Principal NotiPrensa" className="h-20" /> 
          </Link>
          <a href="https://zeno.fm/radio/radio-informativa-98-7-fm/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-white">
            <img src="/Logo-Radio.png" alt="Icono de Radio" className="h-12"/>
            <p className="mt-1 text-xs font-bold font-serif italic">
              Visita nuestra Radio!
            </p>
          </a>
        </div>
      </header>
      
      <nav className="bg-emerald-700 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center space-x-6">
            <NavLink to="/" className={({ isActive }) => isActive ? "text-yellow-300 font-bold" : "text-white hover:text-yellow-300 transition-colors font-medium"}>
              Inicio
            </NavLink>
            <Dropdown />
            {user && (
              <>
                <NavLink to="/admin" className={({ isActive }) => isActive ? "text-yellow-300 font-bold" : "text-white hover:text-yellow-300 transition-colors font-medium"}>Admin</NavLink>
                <NavLink to="/editor" className={({ isActive }) => isActive ? "text-yellow-300 font-bold" : "text-white hover:text-yellow-300 transition-colors font-medium"}>Nuevo Artículo</NavLink>
              </>
            )}
          </div>
          
          <div>
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="font-bold text-white">Hola, {user.username}!</span>
                <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors">
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-6">
                <NavLink to="/login" className={({ isActive }) => isActive ? "text-yellow-300 font-bold" : "text-white hover:text-yellow-300 transition-colors font-medium"}>Login</NavLink>
                <NavLink to="/register" className={({ isActive }) => isActive ? "text-yellow-300 font-bold" : "text-white hover:text-yellow-300 transition-colors font-medium"}>Registrar</NavLink>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="p-4 md:p-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/article/:id" element={<ArticleDetailPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/editor" element={<EditorPage />} />
            <Route path="/editor/:id" element={<EditorPage />} />
          </Route>
        </Routes>
      </main>
    </Router>
  );
}