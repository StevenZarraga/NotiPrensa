import React from "react";
import { Link } from "react-router-dom";
import { capitalizeWords } from '../utils/textUtils.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ArticleCard({ article }) {
  const imageUrl = article.image ? `${API_BASE_URL}${article.image}` : null;

  return (
    <Link to={`/article/${article._id}`} className="block hover:opacity-90 transition-opacity h-full">
      <div className="border rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col h-full">
        {imageUrl && (
          // MODIFICADO: Volvemos a una altura fija (h-48) en lugar de aspect-video.
          // Esto asegura que todas las tarjetas en la cuadrícula tengan la misma altura.
          <div className="h-48 w-full flex-shrink-0">
            <img
              src={imageUrl}
              alt={article.title}
              // La clase object-cover es clave aquí para que la imagen llene el contenedor.
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-6 flex flex-col flex-grow">
          {article.categories && article.categories.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {article.categories.map((category) => (
                <span key={category._id} className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {capitalizeWords(category.name)}
                </span>
              ))}
            </div>
          )}
          
          <h2 className="text-2xl font-bold mb-2 text-gray-800">{article.title}</h2>
          <p className="text-sm text-gray-600 mb-4">
            Por: {article.author} - {new Date(article.createdAt).toLocaleDateString('es-ES')}
          </p>
          <p className="text-gray-700 leading-relaxed line-clamp-3 mt-auto">
            {article.content}
          </p>
        </div>
      </div>
    </Link>
  );
}