const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  order: { type: Number, default: 0 }, // порядковый номер блока
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Module', moduleSchema);
