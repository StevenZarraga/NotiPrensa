const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Category = require('../models/Category.js');
const Article = require('../models/Article.js');
const { protect } = require('../middleware/authMiddleware.js');

// RUTA GET: Obtener todas las categorías
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor al obtener las categorías.' });
  }
});

// RUTA POST: Crear una nueva categoría
router.post('/', protect, async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'El nombre de la categoría es requerido.' });
  }
  try {
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ message: 'Esa categoría ya existe.' });
    }
    const category = new Category({ name });
    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor al crear la categoría.' });
  }
});

// RUTA GET: Obtener todos los artículos de una categoría específica
router.get('/:id/articles', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Categoría no válida.' });
    }

    const categoryId = req.params.id;

    const articles = await Article.find({ categories: categoryId })
      .populate('categories', 'name')
      .sort({ createdAt: -1 });

    res.json(articles);
  } catch (error) {
    console.error("Error al obtener artículos por categoría:", error);
    res.status(500).json({ message: "Error del servidor." });
  }
});

module.exports = router;