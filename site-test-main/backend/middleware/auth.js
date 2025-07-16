module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (typeof req.isAuthenticated === 'function' && req.isAuthenticated()) {
      return next();
    }
    req.flash('error', 'Пожалуйста войдите для доступа');
    res.redirect('/login');
  },

  ensureStudent: (req, res, next) => {
    if (req.user.role === 'student') return next();
    req.flash('error', 'Доступно только студентам');
    res.redirect('back');
  },

  ensureTeacher: (req, res, next) => {
    if (req.user.role === 'teacher' || req.user.role === 'admin') return next();
    req.flash('error', 'Доступно только преподавателям');
    res.redirect('back');
  },

  ensureAdmin: (req, res, next) => {
    if (req.user && req.user.role === 'admin') return next();
    req.flash('error', 'Доступно только администраторам');
    res.redirect('/');
  },
  ensureCourseOwner: async (req, res, next) => {
    try {
      // id курса может быть в req.params.id или req.params.courseId
      const courseId = req.params.id || req.params.courseId; 
      const course = await Course.findById(courseId);

      if (!course) {
        req.flash('error', 'Курс не найден');
        return res.redirect('/courses');
      }
      
      if (req.user.role === 'admin' || course.createdBy.equals(req.user._id)) {
        return next();
      }
      
      req.flash('error', 'У вас нет прав для выполнения этого действия');
      res.redirect(`/courses/${courseId}`);

    } catch (error) {
      console.error(error);
      req.flash('error', 'Ошибка сервера');
      res.redirect('/courses');
    }
  }
};

