const Lesson = require('../models/Lesson');
const Module = require('../models/Module');

// Отображение урока
exports.showLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate('module')
      .populate({
        path: 'module',
        populate: {
          path: 'course'
        }
      });

    if (!lesson) {
      return res.status(404).render('error', { 
        message: 'Урок не найден',
        user: req.user || null
      });
    }

    res.render('lessons/show', { lesson });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
};

// Форма создания урока (для учителей)
exports.newLessonForm = async (req, res) => {
  try {
    const module = await Module.findById(req.params.moduleId);
    res.render('lessons/new', { module });
  } catch (error) {
    console.error(error);
    res.redirect(`/courses/${req.params.id}/modules/${req.params.moduleId}`);
  }
};

// Создание урока
exports.createLesson = async (req, res) => {
  try {
    const { title, content, videoUrl } = req.body;
    const lesson = new Lesson({
      title,
      content,
      videoUrl,
      module: req.params.moduleId,
      order: parseInt(req.body.order) || 0
    });
    
    await lesson.save();
    res.redirect(`/courses/${req.params.id}/modules/${req.params.moduleId}`);
  } catch (error) {
    console.error(error);
    res.redirect(`/courses/${req.params.id}/modules/${req.params.moduleId}/lessons/new`);
  }
};

// Форма редактирования урока
exports.editLessonForm = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    res.render('lessons/edit', { lesson });
  } catch (error) {
    console.error(error);
    res.redirect(`/lessons/${req.params.lessonId}`);
  }
};

// Обновление урока
exports.updateLesson = async (req, res) => {
  try {
    const { title, content, videoUrl } = req.body;
    await Lesson.findByIdAndUpdate(req.params.lessonId, {
      title,
      content,
      videoUrl,
      order: parseInt(req.body.order) || 0
    });
    
    res.redirect(`/lessons/${req.params.lessonId}`);
  } catch (error) {
    console.error(error);
    res.redirect(`/lessons/${req.params.lessonId}/edit`);
  }
};
