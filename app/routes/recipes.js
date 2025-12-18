const express = require('express'),
    recipesRoutes = express.Router(),
    RecipeController = require('../controllers/recipe');

module.exports = (app) => {

    recipesRoutes.get('/recipes', RecipeController.getAll);

    recipesRoutes.get('/recipes/new', RecipeController.new);
    recipesRoutes.post('/recipes/create', RecipeController.new);

    recipesRoutes.get('/recipes/filter', RecipeController.filterByCategory);

    recipesRoutes.get('/recipes/:id', RecipeController.getById);

    recipesRoutes.get('/recipes/:id/edit', RecipeController.edit);
    recipesRoutes.post('/recipes/:id/update', RecipeController.edit);

    recipesRoutes.post('/recipes/:id/changeStatus', RecipeController.changeStatus);

    recipesRoutes.get('/recipes/:id/delete', RecipeController.deleteById);

    app.use('/', recipesRoutes);

};