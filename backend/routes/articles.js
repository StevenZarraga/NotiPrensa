const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Article = require('../models/Article.js');
const { protect } = require('../middleware/authMiddleware.js');

// Configuración de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// --- RUTA GET (TODOS LOS ARTÍCULOS) ---
// MODIFICADA PARA ACEPTAR PAGINACIÓN
router.get('/', async (req, res) => {
  try {
    // 1. Leemos los parámetros de la URL. Si no vienen, usamos valores por defecto.
    const page = parseInt(req.query.page) || 1; // Página actual, por defecto la 1
    const limit = parseInt(req.query.limit) || 6; // Artículos por página, por defecto 6

    // 2. Calculamos cuántos documentos debemos "saltar" para llegar a la página correcta.
    // Para la página 1 no saltamos nada (1-1)*6=0. Para la página 2, saltamos 6 (2-1)*6=6.
    const skip = (page - 1) * limit;

    // 3. Hacemos dos consultas a la base de datos en paralelo para ser más eficientes:
    const [articles, totalArticles] = await Promise.all([
      // Consulta A: Trae solo los artículos de la página actual.
      Article.find()
        .populate('categories', 'name')
        .sort({ createdAt: -1 })
        .limit(limit) // Aplica el límite de artículos por página
        .skip(skip),   // Salta los artículos de las páginas anteriores
      
      // Consulta B: Cuenta el número total de artículos que hay en la base de datos.
      Article.countDocuments()
    ]);

    // 4. Devolvemos un objeto con los artículos y la información de paginación.
    res.json({
      articles,
      totalPages: Math.ceil(totalArticles / limit), // Calculamos el total de páginas
      currentPage: page
    });
    
  } catch (err) {
    res.status(500).json({ message: "Error al obtener los artículos." });
  }
});

// --- RUTA GET (UN SOLO ARTÍCULO) MODIFICADA ---
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate('categories', 'name');
    if (!article) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor al buscar el artículo' });
  }
});


// --- RUTA POST (CREAR ARTÍCULO)
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, content, author, categories } = req.body;
    
    const newArticle = new Article({
      title,
      content,
      author,
      categories: categories ? JSON.parse(categories) : [],
      image: req.file ? `/uploads/${req.file.filename}` : null
    });

    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al guardar el artículo." });
  }
});


// --- RUTA PUT (ACTUALIZAR ARTÍCULO)
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, content, author, categories } = req.body;
    const updatedData = { 
      title, 
      content, 
      author, 
      categories: categories ? JSON.parse(categories) : [] 
    };

    if (req.file) {
      updatedData.image = `/uploads/${req.file.filename}`;
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedArticle) {
      return res.status(404).json({ message: 'No se encontró el artículo para actualizar' });
    }
    res.json(updatedArticle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor al intentar actualizar el artículo' });
  }
});


// RUTA DELETE
router.delete('/:id', protect, async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'No se encontró el artículo' });
    }
    res.json({ message: 'Artículo eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor al intentar eliminar el artículo' });
  }
});

module.exports = router;