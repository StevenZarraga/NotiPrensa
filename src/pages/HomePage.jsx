import React, { useState, useEffect } from "react";
import axios from "axios";
import ArticleCard from "../components/ArticleCard.jsx";

export default function HomePage() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      let url = "http://localhost:5000/api/articles";

      if (selectedCategory) {
        url = `http://localhost:5000/api/categories/${selectedCategory}/articles`;
      }

      try {
        const response = await axios.get(url);
        setArticles(response.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [selectedCategory]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 text-center tracking-tight">
          Periódico Digital
        </h1>
        
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              !selectedCategory ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => setSelectedCategory(category._id)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                selectedCategory === category._id ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Cargando artículos...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.length > 0 ? (
              articles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">No se encontraron artículos para esta categoría.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}