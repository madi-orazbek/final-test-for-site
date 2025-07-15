const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const assignmentController = require('../controllers/assignmentController');
const { ensureAuthenticated, ensureTeacher } = require('../middleware/auth');

// Просмотр всех курсов
router.get('/', courseController.getAllCourses);

// Создание курса (только для преподавателей)
router.get('/new', ensureAuthenticated, ensureTeacher, courseController.newCourse);
router.post('/', ensureAuthenticated, ensureTeacher, courseController.createCourse);

// Детали курса
router.get('/:id', ensureAuthenticated, courseController.getCourseDetails);

// Запись на курс
router.post('/:id/enroll', ensureAuthenticated, courseController.enrollInCourse);

// Создание задания для курса
router.get('/:courseId/assignments/new', 
  ensureAuthenticated, 
  ensureTeacher, 
  assignmentController.newAssignment
);

router.get('/:id/modules/new', ensureTeacher, moduleController.newModuleForm);
router.post('/:id/modules', ensureTeacher, moduleController.createModule);

router.post('/:courseId/assignments', 
  ensureAuthenticated, 
  ensureTeacher, 
  assignmentController.createAssignment
);
// Редактирование курса
router.get('/:id/edit', ensureTeacher, courseController.editCourseForm);
router.put('/:id', ensureTeacher, courseController.updateCourse);

// Удаление курса
router.delete('/:id', ensureTeacher, courseController.deleteCourse);
module.exports = router;
