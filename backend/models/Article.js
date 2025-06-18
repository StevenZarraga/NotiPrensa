const mongoose = require('mongoose');
const { Schema } = mongoose;

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  image: { type: String },
  categories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }]
}, {
  timestamps: true 
});

module.exports = mongoose.model('Article', articleSchema);