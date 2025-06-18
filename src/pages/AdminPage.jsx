import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminArticleRow from '../components/AdminArticleRow.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminPage() {
  const [articles, setArticles] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/articles");
        setArticles(response.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };
    fetchArticles();
  }, []);

  const handleDeleteArticle = async (idToDelete) => {
    const confirmed = window.confirm("¿Estás seguro de que quieres eliminar este artículo?");
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/articles/${idToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setArticles(currentArticles =>
        currentArticles.filter(article => article._id !== idToDelete)
      );
    } catch (error) {
      console.error("Error al eliminar el artículo:", error);
      alert("No se pudo eliminar el artículo. Puede que tu sesión haya expirado.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
      </div>
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
  );
}