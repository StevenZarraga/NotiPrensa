// En: src/pages/HomePage.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import ArticleCard from "../components/ArticleCard.jsx";
import { capitalizeWords } from '../utils/textUtils.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function HomePage() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- NUEVOS ESTADOS PARA LA PAGINACIÓN ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  // ---

  useEffect(() => {
    // La carga de categorías no cambia.
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/categories/active`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    // --- LÓGICA DE CARGA MODIFICADA ---
    const fetchArticles = async (pageToFetch) => {
      setLoading(true);
      let url;

      // Si hay una categoría seleccionada, la paginación se desactiva temporalmente
      // y se muestran todos los artículos de esa categoría.
      if (selectedCategory) {
        url = `${API_BASE_URL}/api/categories/${selectedCategory}/articles`;
      } else {
        // Si no, se piden los artículos paginados.
        url = `${API_BASE_URL}/api/articles?page=${pageToFetch}&limit=6`;
      }

      try {
        const response = await axios.get(url);
        if (selectedCategory) {
          // Si es por categoría, la respuesta es un array simple.
          setArticles(response.data);
          setTotalPages(0); // No hay paginación por categoría por ahora.
        } else {
          // Si es la carga general, la respuesta es un objeto con datos de paginación.
          setArticles(response.data.articles);
          setTotalPages(response.data.totalPages);
          setCurrentPage(response.data.currentPage);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    // ---

    fetchArticles(currentPage);
  }, [selectedCategory, currentPage]); // Se ejecuta cuando cambia la categoría o la página actual

  // --- NUEVA FUNCIÓN PARA CAMBIAR DE PÁGINA ---
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  // ---

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 text-center tracking-tight">
          Periódico Digital
        </h1>
        
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {/* Botones de categorías (sin cambios en su lógica) */}
          <button
            onClick={() => { setSelectedCategory(null); setCurrentPage(1); }}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${!selectedCategory ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'}`}
          >
            Todos
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => { setSelectedCategory(category._id); setCurrentPage(1); }}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${selectedCategory === category._id ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'}`}
            >
              {capitalizeWords(category.name)}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Cargando artículos...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.length > 0 ? (
                articles.map((article) => (
                  <ArticleCard key={article._id} article={article} />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500">No se encontraron artículos.</p>
              )}
            </div>

            {/* --- SECCIÓN DE PAGINACIÓN NUEVA --- */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-10 space-x-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <span className="text-sm text-gray-700">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            )}
            {/* --- FIN DE LA SECCIÓN --- */}
          </>
        )}
      </div>
    </div>
  );
}