// npm install express sequelize sqlite3 ejs serve-favicon nodemon dotenv
require('dotenv').config();
const sequelize = require('./app/config/database');

const express = require('express'),
    favicon = require('serve-favicon'),
    path = require('path');

const main = async () => {
    const app = express();

    app.use(express.urlencoded({extended: true, limit: '10mb'}));
    app.use(express.json({ limit: '10mb' }));

    app.set('views', path.join(__dirname, 'app', 'views'));
    app.set('view engine', 'ejs');
    app.use(favicon(__dirname + '/public/favicon.ico'));

    await sequelize.authenticate();
    require('./app/models');
    await sequelize.sync();

    require('./app/routes/recipes')(app);
    require('./app/routes/categories')(app);

    app.get('/errors', (req, res, next) => {
        return res.render('errors');
    });

    app.use((req, res, next) => {
        return res.redirect('/recipes');
    });

    app.listen(process.env.SERVER_PORT, () => {
        console.log(`Server is running on port ${process.env.SERVER_PORT}`);
    });
}

main();

module.exports = sequelize;