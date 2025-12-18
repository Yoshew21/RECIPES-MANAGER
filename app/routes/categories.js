const express = require('express'),
    categoriesRoutes = express.Router(),
    CategoryController = require('../controllers/category');

module.exports = (app) => {

    categoriesRoutes.get('/categories', CategoryController.getAll);

    categoriesRoutes.get('/categories/new', CategoryController.new);
    categoriesRoutes.post('/categories/create', CategoryController.new);

    categoriesRoutes.get('/categories/:id', CategoryController.getById);

    categoriesRoutes.get('/categories/:id/edit', CategoryController.edit);
    categoriesRoutes.post('/categories/:id/update', CategoryController.edit);

    categoriesRoutes.get('/categories/:id/delete', CategoryController.deleteById);

    app.use('/', categoriesRoutes);

};