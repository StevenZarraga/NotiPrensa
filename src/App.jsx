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
      <nav className="bg-green-300 p-4 shadow-md flex justify-between items-center">
        <div>
          <Link to="/" className="mr-6 font-bold text-gray-800 hover:text-indigo-600 transition-colors">
            Inicio
          </Link>
          {user && (
            <>
              <Link to="/admin" className="mr-6 text-gray-700 hover:text-indigo-600 transition-colors">Admin</Link>
              <Link to="/editor" className="text-gray-700 hover:text-indigo-600 transition-colors">Nuevo Artículo</Link>
            </>
          )}
        </div>
        <div>
          {user ? (
            <div className="flex items-center">
              <span className="mr-4 text-gray-800">Hola, {user.username}!</span>
              <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors">
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="mr-4 text-gray-700 hover:text-indigo-600 transition-colors">Login</Link>
              <Link to="/register" className="text-gray-700 hover:text-indigo-600 transition-colors">Registrar</Link>
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