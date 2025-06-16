// frontend/src/pages/EditorPage.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';

export default function EditorPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Estado de carga

  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // Este es el bloque de código que no se está ejecutando correctamente
  useEffect(() => {
    const resetForm = () => {
      setTitle('');
      setContent('');
      setAuthor('');
      setImageFile(null);
    };

    if (isEditMode) {
      setIsLoading(true);
      axios.get(`http://localhost:5000/api/articles/${id}`)
        .then(response => {
          const { title, content, author } = response.data;
          setTitle(title);
          setContent(content);
          setAuthor(author);
        })
        .catch(error => {
          console.error("Error al cargar datos para editar:", error);
          alert("El artículo que intentas editar no existe o hubo un error.");
          navigate('/admin');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      resetForm();
    }
  }, [id, isEditMode, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("author", author);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const method = isEditMode ? 'put' : 'post';
    const url = isEditMode 
      ? `http://localhost:5000/api/articles/${id}` 
      : "http://localhost:5000/api/articles";

    try {
      await axios[method](url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert(`Artículo ${isEditMode ? 'actualizado' : 'publicado'} exitosamente`);
      navigate('/admin');
    } catch (err) {
      console.error("Error al guardar el artículo:", err);
      alert("Ocurrió un error al guardar.");
    }
  };
  
  if (isLoading) {
    return <div className="p-8 text-center font-bold">Cargando datos del artículo...</div>;
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {isEditMode ? 'Editando Artículo' : 'Crear un Nuevo Artículo'}
      </h1>
      <form onSubmit={handleSubmit}>
         <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full p-2 mb-4 border rounded"
          required
        />
        <textarea
          placeholder="Contenido"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="block w-full p-2 mb-4 border rounded h-40"
          required
        />
        <input
          type="text"
          placeholder="Autor"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="block w-full p-2 mb-4 border rounded"
          required
        />
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {isEditMode ? 'Reemplazar imagen (opcional)' : 'Subir imagen (opcional)'}
        </label>
        <input
          type="file"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="block w-full mb-4"
        />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          {isEditMode ? 'Actualizar Artículo' : 'Publicar'}
        </button>
      </form>
    </div>
  );
}