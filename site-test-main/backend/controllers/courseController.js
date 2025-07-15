const Course = require('../models/Course');
const Module = require('../models/Module');
const Assignment = require('../models/Assignment');

// Создание нового курса (с сохранением создателя)
exports.createCourse = async (req, res) => {
    try {
        const { title, description, grade } = req.body;
        const course = new Course({
            title,
            description,
            grade: grade || 5, // По умолчанию 5 класс
            createdBy: req.user._id
        });
        await course.save();
        res.redirect(`/courses/${course._id}`);
        let isInstructor = false;
        if (req.user) {
          isInstructor = course.createdBy._id.toString() === req.user._id.toString();
        }
    
        res.render('courses/show', { 
        course, 
        modules,
        isEnrolled,
        isInstructor, // Важная переменная
        user: req.user
    });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Ошибка при создании курса');
        res.redirect('/courses/new');
    }
};

// Страница создания курса
exports.newCourse = (req, res) => {
    res.render('courses/new', { user: req.user });
};

// Детали курса (теперь с блоками)
exports.getCourseDetails = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('createdBy')
            .populate('students');
        
        if (!course) {
            return res.status(404).render('error', { 
                message: 'Курс не найден',
                user: req.user || null
            });
        }
        
        // Получаем блоки курса
        const modules = await Module.find({ course: req.params.id }).sort('order');
        
        // Проверка записи пользователя на курс
        let isEnrolled = false;
        let isInstructor = false;
        
        if (req.user) {
            isEnrolled = course.students.some(student => 
                student._id.toString() === req.user._id.toString()
            );
            
            isInstructor = course.createdBy._id.toString() === req.user._id.toString();
        }
        
        res.render('courses/show', { 
            course, 
            modules,
            isEnrolled,
            isInstructor,
            user: req.user
        });
    } catch (error) {
        console.error(error);
        res.redirect('/courses');
    }
};

// Запись на курс
exports.enrollInCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).render('error', { 
                message: 'Курс не найден',
                user: req.user || null
            });
        }
        
        // Проверка уже записан ли пользователь
        const isEnrolled = course.students.some(student => 
            student.toString() === req.user._id.toString()
        );
        
        if (!isEnrolled) {
            course.students.push(req.user._id);
            await course.save();
            req.flash('success', 'Вы успешно записались на курс!');
        }
        
        res.redirect(`/courses/${course._id}`);
    } catch (error) {
        console.error(error);
        req.flash('error', 'Ошибка при записи на курс');
        res.redirect('/courses');
    }
};

// Список всех курсов
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .populate('createdBy')
            .sort({ createdAt: -1 });
        
        res.render('courses/index', { 
            courses,
            user: req.user 
        });
    } catch (error) {
        console.error(error);
        res.render('error', { 
            message: 'Ошибка загрузки курсов',
            user: req.user || null
        });
    }
};

// Форма редактирования курса
exports.editCourseForm = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).render('error', { 
                message: 'Курс не найден',
                user: req.user || null
            });
        }
        
        // Проверка прав доступа
        if (course.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            req.flash('error', 'У вас нет прав для редактирования этого курса');
            return res.redirect(`/courses/${course._id}`);
        }
        
        res.render('courses/edit', { 
            course,
            user: req.user 
        });
    } catch (error) {
        console.error(error);
        res.redirect('/courses');
    }
};

// Обновление курса
exports.updateCourse = async (req, res) => {
    try {
        const { title, description, grade } = req.body;
        const course = await Course.findById(req.params.id);
        
        if (!course) {
            return res.status(404).render('error', { 
                message: 'Курс не найден',
                user: req.user || null
            });
        }
        
        // Проверка прав доступа
        if (course.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            req.flash('error', 'У вас нет прав для редактирования этого курса');
            return res.redirect(`/courses/${course._id}`);
        }
        
        course.title = title;
        course.description = description;
        course.grade = grade;
        
        await course.save();
        req.flash('success', 'Курс успешно обновлен');
        res.redirect(`/courses/${course._id}`);
    } catch (error) {
        console.error(error);
        req.flash('error', 'Ошибка при обновлении курса');
        res.redirect(`/courses/${req.params.id}/edit`);
    }
};

// Удаление курса
exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        
        if (!course) {
            return res.status(404).render('error', { 
                message: 'Курс не найден',
                user: req.user || null
            });
        }
        
        // Проверка прав доступа
        if (course.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            req.flash('error', 'У вас нет прав для удаления этого курса');
            return res.redirect(`/courses/${course._id}`);
        }
        
        // Удаляем связанные данные
        await Module.deleteMany({ course: course._id });
        await Assignment.deleteMany({ course: course._id });
        
        await Course.findByIdAndDelete(req.params.id);
        req.flash('success', 'Курс успешно удален');
        res.redirect('/courses');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Ошибка при удалении курса');
        res.redirect(`/courses/${req.params.id}`);
    }
};
