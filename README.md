# Recipe Manager

> Une application web pour gérer vos recettes de cuisine

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D22-brightgreen.svg)](https://nodejs.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Docker](https://img.shields.io/badge/docker-ready-blue.svg)](https://www.docker.com/)

## À propos

Recipe Manager est une application web qui permet de créer, organiser et gérer vos recettes. Développée avec Node.js et Express, elle utilise PostgreSQL comme base de données et Sequelize comme ORM avec un système de migrations.

### Fonctionnalités

- Gestion complète des recettes (créer, modifier, supprimer)
- Catégorisation des recettes
- Ingrédients avec quantités et unités
- Étapes de préparation
- Temps de préparation et cuisson
- Images en base64
- Interface responsive (TailwindCSS via CDN)

## Technologies

| Couche | Technologie |
|---|---|
| Backend | Node.js 22, Express 5 |
| ORM | Sequelize 6 + sequelize-cli |
| Base de données | PostgreSQL 17 |
| Templates | EJS |
| Styling | TailwindCSS (CDN) |
| Conteneurisation | Docker & Docker Compose |

## Prérequis

- Node.js >= 22.x
- npm >= 10.x
- PostgreSQL 17 (ou Docker)

## Installation locale

1. **Cloner le repository**
   ```bash
   git clone https://github.com/Yoshew21/RECIPES-MANAGER.git
   cd RECIPES-MANAGER
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**

   Copier `.env.example` en `.env` et adapter les valeurs :
   ```bash
   cp .env.example .env
   ```
   ```env
   NODE_ENV=development
   SERVER_PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_NAME=recipe_manager_dev
   ```

4. **Lancer PostgreSQL** (via Docker si besoin)
   ```bash
   docker run -d --name pg-dev \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=recipe_manager_dev \
     -p 5432:5432 \
     postgres:17-alpine
   ```

5. **Exécuter les migrations**
   ```bash
   npx sequelize-cli db:migrate
   ```

6. **Démarrer l'application**
   ```bash
   npm start
   ```

   Accessible sur : `http://localhost:3000`

## Déploiement avec Docker Compose

```bash
docker compose up -d --build
```

L'application est accessible sur `http://localhost:8080`.

Au démarrage, le conteneur app attend que PostgreSQL soit prêt (healthcheck), puis exécute automatiquement les migrations avant de lancer le serveur.

```bash
# Arrêter
docker compose down

# Arrêter et supprimer les volumes (efface les données)
docker compose down -v
```

## Structure du projet

```
RECIPES-MANAGER/
├── app/
│   ├── config/
│   │   └── database.js         # Connexion Sequelize
│   ├── controllers/            # Logique métier
│   ├── models/                 # Modèles Sequelize
│   ├── routes/                 # Routes Express
│   └── views/                  # Templates EJS
├── config/
│   └── config.js               # Config sequelize-cli (dev/prod)
├── database/
│   └── migrations/             # Fichiers de migration
├── public/
│   └── favicon.ico
├── .env.example                # Template des variables d'environnement
├── .sequelizerc                # Chemins sequelize-cli
├── docker-compose.yml
├── Dockerfile
├── package.json
└── recipe-manager-run.js       # Point d'entrée
```

## Migrations

Les migrations permettent de faire évoluer le schéma sans perdre les données.

**Créer une migration**
```bash
npx sequelize-cli migration:generate --name add-servings-to-recipe
```

**Appliquer les migrations**
```bash
npx sequelize-cli db:migrate
```

**Annuler la dernière migration**
```bash
npx sequelize-cli db:migrate:undo
```

**Exemple de migration**
```js
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('recipes', 'servings', {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
    },
    async down(queryInterface) {
        await queryInterface.removeColumn('recipes', 'servings');
    },
};
```

## Base de données

Tables créées par les migrations :

| Table | Description |
|---|---|
| `categories` | Catégories de recettes |
| `recipes` | Recettes (titre, auteur, image, statut) |
| `recipe_ingredients` | Ingrédients avec quantité et unité |
| `recipe_steps` | Étapes de préparation |
| `recipe_times` | Temps de préparation/cuisson |

## Scripts npm

```bash
npm start    # Démarre l'application
```

## Auteur

**Yoshew** — [@Yoshew21](https://github.com/Yoshew21)
