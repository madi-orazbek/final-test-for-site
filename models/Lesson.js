const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  order: { type: Number, default: 0 }, // порядковый номер урока
  content: { type: String }, // содержание урока
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lesson', lessonSchema);
