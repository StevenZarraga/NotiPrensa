import React from "react";

export default function ArticleCard({ article }) {
  const imageUrl = article.image ? `http://localhost:5000${article.image}` : null;

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col">
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
        <h2 className="text-2xl font-bold mb-2 text-gray-800">{article.title}</h2>
        <p className="text-sm text-gray-600 mb-4">
          Redactado por: {article.author} - {new Date(article.createdAt).toLocaleDateString()}
        </p>
        <p className="text-gray-700 leading-relaxed line-clamp-3">
          {article.content}
        </p>
      </div>
    </div>
  );
}