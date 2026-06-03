'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('categories', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });

        await queryInterface.createTable('recipes', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            author: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            categoryId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: { model: 'categories', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            status: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            imageBase64: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });

        await queryInterface.createTable('recipe_ingredients', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            recipeId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'recipes', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            quantity: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true,
            },
            unit: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            order: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });

        await queryInterface.createTable('recipe_steps', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            recipeId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'recipes', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            stepNumber: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });

        await queryInterface.createTable('recipe_times', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            recipeId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'recipes', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            type: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            value: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            unit: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'minutes',
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('recipe_times');
        await queryInterface.dropTable('recipe_steps');
        await queryInterface.dropTable('recipe_ingredients');
        await queryInterface.dropTable('recipes');
        await queryInterface.dropTable('categories');
    },
};
