const sequelize = require('../config/database');
const Category = require('./category');
const Recipe = require('./recipe');
const RecipeIngredient = require('./recipeIngredient');
const RecipeStep = require('./recipeStep');
const RecipeTime = require('./recipeTime');

Recipe.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Recipe, { foreignKey: 'categoryId', as: 'recipes' });

Recipe.hasMany(RecipeIngredient, { foreignKey: 'recipeId', as: 'ingredients' });
RecipeIngredient.belongsTo(Recipe, { foreignKey: 'recipeId', as: 'recipe' });

Recipe.hasMany(RecipeStep, { foreignKey: 'recipeId', as: 'steps' });
RecipeStep.belongsTo(Recipe, { foreignKey: 'recipeId', as: 'recipe' });

Recipe.hasMany(RecipeTime, { foreignKey: 'recipeId', as: 'times' });
RecipeTime.belongsTo(Recipe, { foreignKey: 'recipeId', as: 'recipe' });

module.exports = {
    sequelize,
    Category,
    Recipe,
    RecipeIngredient,
    RecipeStep,
    RecipeTime,
};
