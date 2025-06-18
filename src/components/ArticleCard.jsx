import React from "react";
import { Link } from "react-router-dom";

export default function ArticleCard({ article }) {
  const imageUrl = article.image ? `http://localhost:5000${article.image}` : null;

  return (
    <Link to={`/article/${article._id}`} className="block hover:opacity-90 transition-opacity h-full">
      <div className="border rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col h-full">
        {imageUrl && (
          <div className="h-48 w-full flex-shrink-0">
            <img
              src={imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-6 flex flex-col flex-grow">
          {article.categories && article.categories.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {article.categories.map((category) => (
                <span key={category._id} className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {category.name}
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