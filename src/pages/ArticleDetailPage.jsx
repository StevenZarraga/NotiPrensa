import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function ArticleDetailPage() {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/articles/${id}`)
        .then(response => {
          setArticle(response.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching article details:", err);
          setError('No se pudo cargar el artículo. Puede que no exista.');
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <div className="text-center p-10">Cargando artículo...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  if (!article) {
    return <div className="text-center p-10">Artículo no encontrado.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white shadow-lg rounded-lg mt-8">
      {article.image && (
        <img 
          src={`http://localhost:5000${article.image}`} 
          alt={article.title} 
          className="w-full h-96 object-cover rounded-lg mb-8"
        />
      )}
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
        {article.title}
      </h1>
      <p className="text-md text-gray-500 mb-8 border-b pb-4">
        Por <span className="font-semibold">{article.author}</span> | Publicado el {new Date(article.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
      
      <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap">
        {article.content}
      </div>

      <div className="mt-12 pt-6 border-t">
        <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-semibold">
          &larr; Volver a pagina de Inicio
        </Link>
      </div>
    </div>
  );
}