const Module = require('../models/Module');
const Course = require('../models/Course');

// Форма создания нового блока
exports.newModuleForm = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    res.render('modules/new', { course });
  } catch (error) {
    console.error(error);
    res.redirect(`/courses/${req.params.id}`);
  }
};

// Создание нового блока
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
    
    res.redirect(`/courses/${req.params.id}`);
  } catch (error) {
    console.error(error);
    res.redirect(`/courses/${req.params.id}/modules/new`);
  }
};
