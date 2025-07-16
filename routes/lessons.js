const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');
const { ensureAuthenticated, ensureTeacher } = require('../middleware/auth');

// Просмотр урока
router.get('/:id', ensureAuthenticated, lessonController.showLesson);

// Создание урока (только для учителей)
router.get(
  '/courses/:id/modules/:moduleId/lessons/new', 
  ensureTeacher, 
  lessonController.newLessonForm
);

router.post(
  '/courses/:id/modules/:moduleId/lessons', 
  ensureTeacher, 
  lessonController.createLesson
);

// Редактирование урока
router.get(
  '/:lessonId/edit', 
  ensureTeacher, 
  lessonController.editLessonForm
);

router.put(
  '/:lessonId', 
  ensureTeacher, 
  lessonController.updateLesson
);

module.exports = router;
