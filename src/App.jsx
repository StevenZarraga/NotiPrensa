import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

import HomePage from "./pages/HomePage.jsx";
import EditorPage from "./pages/EditorPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ArticleDetailPage from "./pages/ArticleDetailPage.jsx";

export default function App() {
  const { user, logout } = useAuth();

  return (
    <Router>
      <header className="bg-green-200 py-2 shadow-sm">
        <Link to="/" className="flex justify-center">
          <img src="/logo-ofic.png" alt="Logo de la Oficina" className="h-36 w-[600px]" />
        </Link>
      </header>
      <nav className="bg-[#0D6425] p-4 shadow-md flex justify-between items-center">
        <div>
          <Link to="/" className="mr-6 font-bold text-white hover:text-indigo-600 transition-colors">
            Inicio
          </Link>
          {user && (
            <>
              <Link to="/admin" className="mr-6 font-bold text-white hover:text-indigo-600 transition-colors">Admin</Link>
              <Link to="/editor" className="font-bold text-white hover:text-indigo-600 transition-colors">Nuevo Artículo</Link>
            </>
          )}
        </div>
        <div>
          {user ? (
            <div className="flex items-center">
              <span className="mr-4 font-bold text-white">Hola, {user.username}!</span>
              <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors">
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="mr-4 text-white hover:text-indigo-600 transition-colors">Login</Link>
              <Link to="/register" className="text-white hover:text-indigo-600 transition-colors">Registrar</Link>
            </>
          )}
        </div>
      </nav>

      <main className="p-4 md:p-8">
        <Routes>
          {/* --- RUTAS PÚBLICAS --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/article/:id" element={<ArticleDetailPage />} />

          {/* --- RUTAS PROTEGIDAS --- */}
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