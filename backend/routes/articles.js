const { protect } = require('../middleware/authMiddleware');
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Article = require("../models/Article");

// Configuración de multer (movida aquí para mantener todo encapsulado)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// RUTA GET: Obtener todos los artículos
router.get("/", async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener los artículos." });
  }
});

// RUTA GET Articulo Individual
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }
    
    res.json(article); // Enviamos el artículo encontrado
  } catch (error) {
    console.error(error);
    // Este error puede ocurrir si el formato del ID es inválido
    res.status(500).json({ message: 'Error en el servidor al buscar el artículo' });
  }
});

// RUTA POST: Crear un nuevo artículo
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, content, author } = req.body;
    
    const newArticle = new Article({
      title,
      content,
      author,
      image: req.file ? `/uploads/${req.file.filename}` : null
    });

    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al guardar el artículo." });
  }
});

//Ruta PUT: Actualizar articulos
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const updatedData = { title, content, author };

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

//Ruta DELETE: Eliminar articulos
router.delete('/:id', protect, async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'No se encontró el artículo' });
    }

    res.json({ message: 'Artículo eliminado exitosamente' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor al intentar eliminar el artículo' });
  }
});


module.exports = router;