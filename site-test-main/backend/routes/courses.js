const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const moduleController = require('../controllers/moduleController');
const lessonController = require('../controllers/lessonController');
const assignmentController = require('../controllers/assignmentController');
const { ensureAuthenticated, ensureTeacher, ensureCourseOwner } = require('../middleware/auth');

// Список всех курсов
router.get('/', courseController.getAllCourses);

// Создание курса
router.get('/new', ensureTeacher, courseController.newCourse);
router.post('/', ensureTeacher, courseController.createCourse);

// Детали курса
router.get('/:id', courseController.getCourseDetails);
router.get('/:id', ensureAuthenticated, courseController.getCourseDetails);

// Запись на курс
router.post('/:id/enroll', ensureAuthenticated, courseController.enrollInCourse);

// Редактирование курса
router.get('/:id/edit', ensureTeacher, ensureCourseOwner, courseController.editCourseForm);
router.put('/:id', ensureTeacher, ensureCourseOwner, courseController.updateCourse);

// Удаление курса
router.delete('/:id', ensureTeacher, ensureCourseOwner, courseController.deleteCourse);

// Модули курса
router.get('/:id/modules/new', ensureTeacher, ensureCourseOwner, moduleController.newModuleForm);
router.post('/:id/modules', ensureTeacher, ensureCourseOwner, moduleController.createModule);

// Уроки курса
router.get('/:id/modules/:moduleId/lessons/new', 
  ensureTeacher, 
  ensureCourseOwner, 
  lessonController.newLessonForm
);
router.post('/:id/modules/:moduleId/lessons', 
  ensureTeacher, 
  ensureCourseOwner, 
  lessonController.createLesson
);

// Задания курса (если нужно оставить)
router.get('/:courseId/assignments/new', 
  ensureTeacher, 
  ensureCourseOwner, 
  assignmentController.newAssignment
);
router.post('/:courseId/assignments', 
  ensureTeacher, 
  ensureCourseOwner, 
  assignmentController.createAssignment
);

module.exports = router;
