const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const moduleController = require('../controllers/moduleController'); // Проверьте путь
const lessonController = require('../controllers/lessonController');
const assignmentController = require('../controllers/assignmentController');
const { ensureAuthenticated, ensureTeacher, ensureCourseOwner } = require('../middleware/auth');

// Диагностика
console.log('[DEBUG] moduleController:', moduleController);
console.log('[DEBUG] newModuleForm type:', typeof moduleController.newModuleForm);

// Список всех курсов
router.get('/', courseController.getAllCourses);

// Создание курса
router.get('/new', 
  ensureAuthenticated,
  ensureTeacher, 
  courseController.newCourse
);

router.post('/', 
  ensureAuthenticated,
  ensureTeacher, 
  courseController.createCourse
);

// Детали курса
router.get('/:id', 
  ensureAuthenticated, 
  courseController.getCourseDetails
);

// Запись на курс
router.post('/:id/enroll', 
  ensureAuthenticated, 
  courseController.enrollInCourse
);

// Редактирование курса
//router.get('/:id/edit', 
  //ensureAuthenticated,
  //ensureTeacher, 
  //ensureCourseOwner, 
  //courseController.editCourseForm
//);

//router.put('/:id',
  //ensureAuthenticated,
  //ensureTeacher, 
  //ensureCourseOwner,
 // courseController.updateCourse
//);

// Удаление курса
router.delete('/:id',
  ensureAuthenticated,
  ensureTeacher, 
  ensureCourseOwner,
  courseController.deleteCourse
);

// Модули курса (СТРОКА 38)
router.get('/:id/modules/new', 
  ensureAuthenticated,
  ensureTeacher, 
  ensureCourseOwner, 
  moduleController.newModuleForm // Убедитесь, что это функция
);

router.post('/:id/modules', 
  ensureAuthenticated,
  ensureTeacher, 
  ensureCourseOwner, 
  moduleController.createModule
);

// Уроки курса
router.get('/:id/modules/:moduleId/lessons/new', 
  ensureAuthenticated,
  ensureTeacher, 
  ensureCourseOwner, 
  lessonController.newLessonForm
);

router.post('/:id/modules/:moduleId/lessons', 
  ensureAuthenticated,
  ensureTeacher, 
  ensureCourseOwner, 
  lessonController.createLesson
);

// Задания курса
router.get('/:courseId/assignments/new', 
  ensureAuthenticated,
  ensureTeacher, 
  ensureCourseOwner, 
  assignmentController.newAssignment
);

router.post('/:courseId/assignments', 
  ensureAuthenticated,
  ensureTeacher, 
  ensureCourseOwner, 
  assignmentController.createAssignment
);

module.exports = router;
