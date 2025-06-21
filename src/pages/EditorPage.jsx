// En: src/pages/EditorPage.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { capitalizeWords } from '../utils/textUtils.js';

// NUEVO: Leemos la variable de entorno y la guardamos en una constante.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function EditorPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const isEditMode = Boolean(id);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // MODIFICADO: Usamos la nueva constante para construir la URL.
        const response = await axios.get(`${API_BASE_URL}/api/categories`);
        setAllCategories(response.data);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const resetForm = () => {
        setTitle('');
        setContent('');
        setAuthor('');
        setImageFile(null);
        setSelectedCategories([]);
    };

    if (isEditMode) {
      setIsLoading(true);
      // MODIFICADO: Usamos la nueva constante aquí también.
      axios.get(`${API_BASE_URL}/api/articles/${id}`)
        .then(response => {
          const { title, content, author, categories } = response.data;
          setTitle(title);
          setContent(content);
          setAuthor(author);
          setSelectedCategories(categories.map(cat => cat._id)); 
        })
        .catch(error => {
            console.error("Error al cargar datos para editar:", error);
            alert("El artículo que intentas editar no existe.");
            navigate('/admin');
        })
        .finally(() => setIsLoading(false));
    } else {
        resetForm();
    }
  }, [id, isEditMode, navigate]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prevSelected =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter(id => id !== categoryId)
        : [...prevSelected, categoryId]
    );
  };
  
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      // MODIFICADO: Usamos la nueva constante aquí.
      const response = await axios.post(
        `${API_BASE_URL}/api/categories`,
        { name: newCategoryName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAllCategories([...allCategories, response.data]);
      setSelectedCategories([...selectedCategories, response.data._id]);
      setNewCategoryName("");
    } catch (error) {
      alert(error.response?.data?.message || "Error al crear la categoría.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("author", author);
    formData.append("categories", JSON.stringify(selectedCategories));
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    };

    // MODIFICADO: Construimos la URL usando la constante.
    const url = isEditMode 
      ? `${API_BASE_URL}/api/articles/${id}` 
      : `${API_BASE_URL}/api/articles`;
    
    const method = isEditMode ? 'put' : 'post';

    try {
      await axios[method](url, formData, config);
      alert(`Artículo ${isEditMode ? 'actualizado' : 'publicado'} exitosamente`);
      navigate('/admin');
    } catch (err) {
      console.error("Error al guardar el artículo:", err);
      alert("Ocurrió un error al guardar.");
    }
  };
  
  if (isLoading) return <div className="p-8 text-center font-bold">Cargando editor...</div>;

  return (
    // ... tu JSX no necesita cambiar, se queda exactamente igual ...
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        {isEditMode ? 'Editando Artículo' : 'Crear un Nuevo Artículo'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
            <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} required rows="10" className="block w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea>
        </div>
        <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">Autor</label>
            <input id="author" type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required className="block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
        
        <div className="p-4 border rounded-md bg-gray-50">
          <label className="block mb-3 font-semibold text-gray-700">Categorías</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {allCategories.map(category => (
              <label key={category._id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category._id)}
                  onChange={() => handleCategoryChange(category._id)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-gray-700">{capitalizeWords(category.name)}</span>
              </label>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row gap-2">
            <input 
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nombre de nueva categoría"
              className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm"
            />
            <button type="button" onClick={handleCreateCategory} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
              Crear Categoría
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Imagen del Artículo</label>
          <input id="image" type="file" onChange={(e) => setImageFile(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
        </div>
        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-3 rounded-md transition-colors text-lg">
          {isEditMode ? 'Guardar Cambios' : 'Publicar Artículo'}
        </button>
      </form>
    </div>
  );
}