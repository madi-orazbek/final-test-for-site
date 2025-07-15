const Module = require('../models/Module');
const Course = require('../models/Course');

exports.newModuleForm = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    res.render('modules/new', { course, user: req.user });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Ошибка загрузки формы');
    res.redirect(`/courses/${req.params.id}`);
  }
};

exports.createModule = async (req, res) => {
  try {
    const { title } = req.body;
    const module = new Module({
      title,
      course: req.params.id,
      order: parseInt(req.body.order) || 0
    });
    
    await module.save();
    
    // Обновляем курс
    await Course.findByIdAndUpdate(req.params.id, {
      $push: { modules: module._id }
    });
    
    req.flash('success', 'Блок успешно создан');
    res.redirect(`/courses/${req.params.id}`);
  } catch (error) {
    console.error(error);
    req.flash('error', 'Ошибка при создании блока');
    res.redirect(`/courses/${req.params.id}/modules/new`);
  }
};

// Другие методы (редактирование, удаление) можно добавить по аналогии
