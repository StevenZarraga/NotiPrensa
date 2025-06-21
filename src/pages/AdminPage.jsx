import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminArticleRow from '../components/AdminArticleRow.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { capitalizeWords } from '../utils/textUtils.js';

// Definimos la constante de la URL base
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AdminPage() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesRes, categoriesRes] = await Promise.all([
          // Aunque AdminPage no necesita paginación, ahora debe consumir la ruta paginada.
          axios.get(`${API_BASE_URL}/api/articles`),
          axios.get(`${API_BASE_URL}/api/categories`)
        ]);

        // --- LA CORRECCIÓN ESTÁ AQUÍ ---
        // Extraemos el array 'articles' del objeto de respuesta.
        setArticles(articlesRes.data.articles); 
        // ---

        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleDeleteArticle = async (idToDelete) => {
    const confirmed = window.confirm("¿Estás seguro de que quieres eliminar este artículo?");
    if (!confirmed) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/articles/${idToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setArticles(currentArticles =>
        currentArticles.filter(article => article._id !== idToDelete)
      );
    } catch (error) {
      console.error("Error al eliminar el artículo:", error);
      alert("No se pudo eliminar el artículo.");
    }
  };
  
  const handleDeleteCategory = async (idToDelete) => {
    const confirmed = window.confirm("¿Estás seguro de que quieres eliminar esta categoría?");
    if (!confirmed) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/categories/${idToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(currentCategories =>
        currentCategories.filter(category => category._id !== idToDelete)
      );
      alert("Categoría eliminada.");
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
      alert(error.response?.data?.message || "No se pudo eliminar la categoría.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
      </div>

      <div className="mb-10 p-4 border rounded-lg bg-white shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Gestionar Categorías</h2>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {categories.length > 0 ? (
            categories.map(category => (
              <div key={category._id} className="flex justify-between items-center p-2 rounded-md bg-gray-50">
                <span className="font-medium">{capitalizeWords(category.name)}</span>
                <button 
                  onClick={() => handleDeleteCategory(category._id)}
                  className="bg-red-500 text-white font-bold py-1 px-3 rounded hover:bg-red-700 transition-colors"
                  title={`Eliminar categoría ${category.name}`}
                >
                  X
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No hay categorías para mostrar.</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Gestionar Artículos</h2>
        <div className="space-y-4">
          {articles.length > 0 ? (
            articles.map(article => (
              <AdminArticleRow
                key={article._id}
                article={article}
                onDelete={handleDeleteArticle}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 mt-8">No hay artículos para mostrar. ¡Crea uno nuevo!</p>
          )}
        </div>
      </div>
    </div>
  );
}