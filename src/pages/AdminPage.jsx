import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminArticleRow from '../components/AdminArticleRow.jsx';

export default function AdminPage() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/articles")
      .then(res => setArticles(res.data))
      .catch(err => console.error("Error fetching articles:", err));
  }, []);

  const handleDeleteArticle = async (idToDelete) => {
    const confirmed = window.confirm("¿Estás seguro de que quieres eliminar este artículo?");
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/articles/${idToDelete}`);
      setArticles(currentArticles =>
        currentArticles.filter(article => article._id !== idToDelete)
      );
    } catch (error) {
      console.error("Error al eliminar el artículo:", error);
      alert("No se pudo eliminar el artículo.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Panel de Administración de Artículos</h1>
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