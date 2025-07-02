import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminArticleRow({ article, onDelete }) {
  return (
    <div className="flex justify-between items-center p-4 border rounded-lg shadow-sm bg-white">
      <div>
        <h3 className="font-bold text-lg">{article.title}</h3>
        <p className="text-sm text-gray-500">Por: {article.author} - {new Date(article.createdAt).toLocaleDateString()}</p>
      </div>
      
      <div className="flex gap-2">
        <Link to={`/editor/${article._id}`}>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded transition-colors duration-200"
          >
            Editar
          </button>
        </Link>
        <button
          onClick={() => onDelete(article._id)}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded transition-colors duration-200"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}