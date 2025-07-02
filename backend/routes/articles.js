const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2; 
const { CloudinaryStorage } = require('multer-storage-cloudinary'); 
const Article = require('../models/Article.js');
const { protect } = require('../middleware/authMiddleware.js');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'notiprensa', 
    allowed_formats: ['jpeg', 'png', 'jpg'], 
  },
});

const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const [articles, totalArticles] = await Promise.all([
      Article.find()
        .populate('categories', 'name')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip),
      Article.countDocuments()
    ]);

    res.json({
      articles,
      totalPages: Math.ceil(totalArticles / limit),
      currentPage: page
    });
    
  } catch (err) {
    res.status(500).json({ message: "Error al obtener los artículos." });
  }
});

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


router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, content, author, categories } = req.body;
    
    const newArticle = new Article({
      title,
      content,
      author,
      categories: categories ? JSON.parse(categories) : [],
      image: req.file ? req.file.path : null
    });

    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al guardar el artículo." });
  }
});


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
      updatedData.image = req.file.path;
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


router.delete('/:id', protect, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'No se encontró el artículo' });
    }

    if (article.image) {
      const publicId = article.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`notiprensa/${publicId}`);
    }

    await Article.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Artículo eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor al intentar eliminar el artículo' });
  }
});

module.exports = router;