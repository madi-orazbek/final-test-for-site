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
  }
};
// Доступ только к своим курсам (для учителей)
exports.ensureCourseOwner = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).send('Курс не найден');
    
    if (req.user.role === 'admin') return next();
    if (course.createdBy.equals(req.user._id)) return next();
    
    req.flash('error', 'У вас нет прав для редактирования этого курса');
    res.redirect('/courses');
  } catch (error) {
    console.error(error);
    res.redirect('/courses');
  }
};
