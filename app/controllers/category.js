const { Category, Recipe } = require('../models');

/**
 * Method used to get all categories
 * @param req
 * @param res
 * @param next
 */
exports.getAll = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const categories = await Category.findAll({ limit, offset, order: [['name', 'ASC']] });
        const total = await Category.count();
        const totalPages = Math.ceil(total / limit);

        const recipes = await Recipe.findAll();

        const categoriesWithCount = categories.map(category => {
            const recipesCount = recipes.filter(recipe => recipe.categoryId === category.id).length;
            return { ...category.get({ plain: true }), recipesCount };
        });

        res.render('categories/index', { categories: categoriesWithCount, recipes, currentPage: page, totalPages, limit });
    } catch (error) {
        console.error(error);
        res.redirect('/errors');
    }
};


/**
 * Method used to get a category by its ID
 * @param req
 * @param res
 * @param next
 */
exports.getById = async (req, res, next) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            throw new Error('Category not found.');
        }

        const recipes = await Recipe.findAll({ where: { categoryId: category.id } });

        res.render('categories/single', { category, recipes });
    } catch (error) {
        console.error(error);
        res.redirect('/errors');
    }
};

/**
 * Method used to create a category
 * @param req
 * @param res
 * @param next
 */
exports.new = async (req, res, next) => {
    if (req.method === 'POST') {
        try {
            if (!req.body.name) {
                throw new Error('Le nom est obligatoire.');
            }

            await Category.create({
                name: req.body.name,
                description: req.body.description || null,
            });

            res.redirect('/categories');
        } catch (error) {
            console.error(error);
            res.redirect('/errors');
        }
    } else {
        res.render('categories/new', { action: '/categories/new', submitLabel: 'Créer' });
    }
};

/**
 * Method used to edit a category
 * @param req
 * @param res
 * @param next
 */
exports.edit = async (req, res, next) => {
    try {
        if (req.method === 'POST') {
            const { name, description } = req.body;

            const updateData = {
                name,
                description
            };

            const [updatedCount] = await Category.update(updateData, { where: { id: req.params.id } });
            if (updatedCount === 0) throw new Error('Catégorie non trouvée.');

            res.redirect('/categories');
        } else {
            const category = await Category.findByPk(req.params.id);
            if (!category) throw new Error('Catégorie non trouvée.');
            res.render('categories/edit', { category, action: `/categories/${category.id}/update`, submitLabel: 'Mettre à jour' });
        }
    } catch (error) {
        console.error(error);
        res.redirect('/errors');
    }
};

/**
 * Method used to delete a category by its ID
 * @param req
 * @param res
 * @param next
 */
exports.deleteById = async (req, res, next) => {
    try {
        const deletedCount = await Category.destroy({ where: { id: req.params.id } });
        if (deletedCount === 0) throw new Error('Category not found.');
        res.redirect('/categories');
    } catch (error) {
        console.error(error);
        res.redirect('/errors');
    }
};