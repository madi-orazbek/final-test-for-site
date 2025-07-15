// models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  grade: { type: Number, required: true, default: 5 }, // Добавлено поле класса
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Виртуальное поле для количества модулей
courseSchema.virtual('moduleCount', {
  ref: 'Module',
  localField: '_id',
  foreignField: 'course',
  count: true
});

// Виртуальное поле для количества уроков
courseSchema.virtual('lessonCount', {
  ref: 'Lesson',
  localField: '_id',
  foreignField: 'module.course',
  count: true
});
modules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
module.exports = mongoose.model('Course', courseSchema);
