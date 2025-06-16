// models/article.js

const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  image: { type: String } // La ruta a la imagen
}, {
  timestamps: true
});

module.exports = mongoose.model('Article', articleSchema);