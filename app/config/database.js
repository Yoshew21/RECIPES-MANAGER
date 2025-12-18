const path = require('path');
require('dotenv').config();

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.SQLITE_STORAGE || path.join(__dirname, '..', '..', 'recipe-manager.sqlite'),
    logging: false,
});

module.exports = sequelize;
