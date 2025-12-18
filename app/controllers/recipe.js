const { sequelize, Recipe, Category, RecipeIngredient, RecipeStep, RecipeTime } = require('../models');

exports.getAll = async (req, res, next) => {
    try {
        const qRaw = typeof req.query.q === 'string' ? req.query.q : '';
        const q = qRaw.trim();
        const byIngredients = req.query.byIngredients === '1' || req.query.byIngredients === 'true' || req.query.byIngredients === 'on';

        const selectedCategory = req.query.categoryId ? Number(req.query.categoryId) : null;
        const selectedIngredients = Array.isArray(req.query.ingredients)
            ? req.query.ingredients
            : (req.query.ingredients ? [req.query.ingredients] : []);

        const normalize = (value) => String(value || '').trim().toLowerCase();
        const selectedIngredientsNormalized = selectedIngredients
            .map(normalize)
            .filter((value) => value.length > 0);

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const where = {};
        if (Number.isFinite(selectedCategory)) where.categoryId = selectedCategory;

        const recipes = await Recipe.findAll({
            where: Object.keys(where).length ? where : undefined,
            include: [{ model: Category, as: 'category' }],
            order: [['createdAt', 'DESC']],
        });

        const recipeIds = recipes.map((r) => r.id);

        const [categories, ingredientRowsAll] = await Promise.all([
            Category.findAll({ order: [['name', 'ASC']] }),
            RecipeIngredient.findAll({
                attributes: [[sequelize.fn('DISTINCT', sequelize.col('name')), 'name']],
                raw: true,
            }),
        ]);

        const allIngredients = ingredientRowsAll
            .map((row) => row.name)
            .map((name) => String(name || '').trim())
            .filter((name) => name.length > 0)
            .sort((a, b) => a.localeCompare(b, 'fr'));

        // Si on a besoin de chercher dans le contenu (ingrédients/étapes) ou filtrer par ingrédients,
        // on récupère les ingrédients/étapes des recettes affichées.
        let recipesFiltered = recipes;
        if ((q.length > 0 || (byIngredients && selectedIngredientsNormalized.length > 0)) && recipeIds.length > 0) {
            const [ingredientRows, stepRows] = await Promise.all([
                RecipeIngredient.findAll({
                    where: { recipeId: recipeIds },
                    attributes: ['recipeId', 'name'],
                    raw: true,
                }),
                RecipeStep.findAll({
                    where: { recipeId: recipeIds },
                    attributes: ['recipeId', 'description'],
                    raw: true,
                }),
            ]);

            const ingredientsByRecipeId = new Map();
            for (const row of ingredientRows) {
                const recipeId = row.recipeId;
                const name = normalize(row.name);
                if (!name) continue;
                const list = ingredientsByRecipeId.get(recipeId) || [];
                list.push(name);
                ingredientsByRecipeId.set(recipeId, list);
            }

            const stepsTextByRecipeId = new Map();
            for (const row of stepRows) {
                const recipeId = row.recipeId;
                const text = String(row.description || '').toLowerCase();
                if (!text) continue;
                const list = stepsTextByRecipeId.get(recipeId) || [];
                list.push(text);
                stepsTextByRecipeId.set(recipeId, list);
            }

            // Recherche texte (titre + créateur + ingrédients + étapes)
            if (q.length > 0) {
                const qNorm = q.toLowerCase();
                recipesFiltered = recipesFiltered.filter((recipe) => {
                    const haystackParts = [
                        String(recipe.title || '').toLowerCase(),
                        String(recipe.author || '').toLowerCase(),
                        ...(ingredientsByRecipeId.get(recipe.id) || []),
                        ...(stepsTextByRecipeId.get(recipe.id) || []),
                    ];
                    return haystackParts.some((part) => part.includes(qNorm));
                });
            }

            // Filtre exact par ingrédients (la recette doit contenir UNIQUEMENT ces ingrédients)
            if (byIngredients && selectedIngredientsNormalized.length > 0) {
                const selectedSet = new Set(selectedIngredientsNormalized);
                recipesFiltered = recipesFiltered.filter((recipe) => {
                    const recipeIngredients = (ingredientsByRecipeId.get(recipe.id) || []).map(normalize);
                    const recipeSet = new Set(recipeIngredients.filter(Boolean));
                    if (recipeSet.size !== selectedSet.size) return false;
                    for (const ing of selectedSet) {
                        if (!recipeSet.has(ing)) return false;
                    }
                    return true;
                });
            }
        }

        const total = recipesFiltered.length;
        const totalPages = Math.ceil(total / limit);
        const paginatedRecipes = recipesFiltered.slice(offset, offset + limit);

        res.render('recipes/index', {
            recipes: paginatedRecipes,
            categories,
            selectedCategory,
            q,
            byIngredients,
            allIngredients,
            selectedIngredients: selectedIngredientsNormalized,
            currentPage: page,
            totalPages,
            limit,
        });
    } catch (error) {
        console.error(error);
        return res.redirect('/errors');
    }
};

/**
 * Method used to get a recipe by its ID
 * @param req
 * @param res
 * @param next
 */
exports.getById = async (req, res, next) => {
    try {
        if (req.path.includes('new') || req.path.includes('edit')) {
            return next();
        }
        const recipe = await Recipe.findByPk(req.params.id, {
            include: [
                { model: Category, as: 'category' },
                { model: RecipeIngredient, as: 'ingredients', separate: true, order: [['order', 'ASC']] },
                { model: RecipeStep, as: 'steps', separate: true, order: [['stepNumber', 'ASC']] },
                { model: RecipeTime, as: 'times' }
            ],
        });
        const categories = await Category.findAll({ limit: 50, order: [['name', 'ASC']] });
        if (!recipe) {
            throw new Error('Recipe not found.');
        }
        res.render('recipes/single', { recipe, categories });
    } catch (error) {
        console.error(error);
        res.redirect('/errors');
    }
};

/**
 * Method used to filter recipes by category
 * @param req
 * @param res
 * @param next
 */
exports.filterByCategory = async (req, res, next) => {
    return exports.getAll(req, res, next);
};

/**
 * Method used to create a recipe
 * @param req
 * @param res
 * @param next
 */
exports.new = async (req, res, next) => {
    if (req.method === 'POST') {
        try {
            if (!req.body || !req.body.title || !req.body.author || !req.body.categoryId) {
                throw new Error('Tous les champs sont obligatoires.');
            }
            const status = req.body.status === 'true' || req.body.status === true;
            
            // Créer la recette
            const recipe = await Recipe.create({
                title: req.body.title,
                author: req.body.author,
                status,
                categoryId: Number(req.body.categoryId),
                imageBase64: req.body.imageBase64 || null,
            });

            // Créer les ingrédients
            if (req.body.ingredients && Array.isArray(req.body.ingredients)) {
                const ingredientsData = req.body.ingredients
                    .filter(ing => ing.name && ing.name.trim() !== '')
                    .map((ing, index) => ({
                        recipeId: recipe.id,
                        name: ing.name.trim(),
                        quantity: ing.quantity ? parseFloat(ing.quantity) : null,
                        unit: ing.unit || null,
                        order: index,
                    }));
                if (ingredientsData.length > 0) {
                    await RecipeIngredient.bulkCreate(ingredientsData);
                }
            }

            // Créer les étapes
            if (req.body.steps && Array.isArray(req.body.steps)) {
                const stepsData = req.body.steps
                    .filter(step => step.description && step.description.trim() !== '')
                    .map((step, index) => ({
                        recipeId: recipe.id,
                        stepNumber: index + 1,
                        description: step.description.trim(),
                    }));
                if (stepsData.length > 0) {
                    await RecipeStep.bulkCreate(stepsData);
                }
            }

            // Créer les temps
            if (req.body.times && Array.isArray(req.body.times)) {
                const timesData = req.body.times
                    .filter(time => time.type && time.value)
                    .map(time => ({
                        recipeId: recipe.id,
                        type: time.type.trim(),
                        value: parseInt(time.value),
                        unit: time.unit || 'minutes',
                    }));
                if (timesData.length > 0) {
                    await RecipeTime.bulkCreate(timesData);
                }
            }

            res.redirect('/recipes');
        } catch (error) {
            console.error(error);
            res.redirect('/errors');
        }
    } else {
        try {
            const categories = await Category.findAll({ limit: 50, order: [['name', 'ASC']] });
            res.render('recipes/new', {
                action: '/recipes/create',
                submitLabel: 'AJOUTER !',
                recipe: null,
                categories: categories
            });
        } catch (error) {
            console.error(error);
            res.redirect('/errors');
        }
    }
};

/**
 * Method used to edit a recipe
 * @param req
 * @param res
 * @param next
 */
exports.edit = async (req, res, next) => {
    try {
        if (req.method === 'POST') {
            const { title, author, status, categoryId, imageBase64 } = req.body;
            const updateData = {
                title,
                author,
                status: status === 'true' || status === true,
                categoryId: categoryId ? Number(categoryId) : null,
                imageBase64: imageBase64 || null,
            };
            const [updatedCount] = await Recipe.update(updateData, { where: { id: req.params.id } });
            if (updatedCount === 0) {
                throw new Error('Recipe not found.');
            }

            const recipeId = req.params.id;

            // Supprimer les anciens ingrédients, étapes et temps
            await RecipeIngredient.destroy({ where: { recipeId } });
            await RecipeStep.destroy({ where: { recipeId } });
            await RecipeTime.destroy({ where: { recipeId } });

            // Créer les nouveaux ingrédients
            if (req.body.ingredients && Array.isArray(req.body.ingredients)) {
                const ingredientsData = req.body.ingredients
                    .filter(ing => ing.name && ing.name.trim() !== '')
                    .map((ing, index) => ({
                        recipeId: recipeId,
                        name: ing.name.trim(),
                        quantity: ing.quantity ? parseFloat(ing.quantity) : null,
                        unit: ing.unit || null,
                        order: index,
                    }));
                if (ingredientsData.length > 0) {
                    await RecipeIngredient.bulkCreate(ingredientsData);
                }
            }

            // Créer les nouvelles étapes
            if (req.body.steps && Array.isArray(req.body.steps)) {
                const stepsData = req.body.steps
                    .filter(step => step.description && step.description.trim() !== '')
                    .map((step, index) => ({
                        recipeId: recipeId,
                        stepNumber: index + 1,
                        description: step.description.trim(),
                    }));
                if (stepsData.length > 0) {
                    await RecipeStep.bulkCreate(stepsData);
                }
            }

            // Créer les nouveaux temps
            if (req.body.times && Array.isArray(req.body.times)) {
                const timesData = req.body.times
                    .filter(time => time.type && time.value)
                    .map(time => ({
                        recipeId: recipeId,
                        type: time.type.trim(),
                        value: parseInt(time.value),
                        unit: time.unit || 'minutes',
                    }));
                if (timesData.length > 0) {
                    await RecipeTime.bulkCreate(timesData);
                }
            }

            res.redirect('/recipes');
        } else {
            const recipe = await Recipe.findByPk(req.params.id, {
                include: [
                    { model: Category, as: 'category' },
                    { model: RecipeIngredient, as: 'ingredients', separate: true, order: [['order', 'ASC']] },
                    { model: RecipeStep, as: 'steps', separate: true, order: [['stepNumber', 'ASC']] },
                    { model: RecipeTime, as: 'times' }
                ],
            });
            if (!recipe) {
                throw new Error('Recipe not found.');
            }
            const categories = await Category.findAll({ limit: 50, order: [['name', 'ASC']] });
            res.render('recipes/edit', {
                recipe,
                categories,
                action: `/recipes/${recipe.id}/update`,
                submitLabel: 'MODIFIER !'
            });
        }
    } catch (error) {
        console.error(error);
        res.redirect('/errors');
    }
};

/**
 * Method used to change the status of a recipe
 * @param req
 * @param res
 * @param next
 */
exports.changeStatus = async (req, res, next) => {
    try {
        const recipe = await Recipe.findByPk(req.params.id);
        if (!recipe) {
            throw new Error('Recipe not found.');
        }

        await recipe.update({ status: !recipe.status });

        res.redirect('/recipes');
    } catch (error) {
        console.error(error);
        res.redirect('/errors');
    }
};

/**
 * Method used to delete a recipe by its ID
 * @param req
 * @param res
 * @param next
 */
exports.deleteById = async (req, res, next) => {
    try {
        const deletedCount = await Recipe.destroy({ where: { id: req.params.id } });
        if (deletedCount === 0) {
            throw new Error('Recipe not found.');
        }
        res.redirect('/recipes');
    } catch (error) {
        console.error(error);
        res.redirect('/errors');
    }
};
