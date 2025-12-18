const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RecipeTime = sequelize.define('RecipeTime', {
    recipeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'recipes',
            key: 'id'
        }
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    value: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    unit: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'minutes',
    },
}, {
    tableName: 'recipe_times',
    timestamps: true,
});

module.exports = RecipeTime;

