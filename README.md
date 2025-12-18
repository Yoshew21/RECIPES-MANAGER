# 🍳 Recipe Manager

> Une application web moderne et intuitive pour gérer vos recettes de cuisine

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg)](https://nodejs.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Docker](https://img.shields.io/badge/docker-ready-blue.svg)](https://www.docker.com/)

## 📋 À propos

Recipe Manager est une application web complète qui vous permet de créer, organiser et rechercher vos recettes préférées. Développée avec Node.js et Express, elle offre une interface élégante utilisant TailwindCSS et stocke vos données de manière persistante avec SQLite.

### ✨ Fonctionnalités principales

- 📝 **Gestion complète des recettes** - Créez, modifiez et supprimez vos recettes
- 🏷️ **Catégorisation** - Organisez vos recettes par catégories (entrées, plats, desserts, etc.)
- 🔍 **Recherche avancée** - Trouvez vos recettes par nom, ingrédients ou catégorie
- ⏱️ **Temps de préparation** - Suivez les temps de préparation et de cuisson
- 📷 **Images** - Ajoutez des images à vos recettes (stockées en base64)
- 📱 **Interface responsive** - Design moderne adapté à tous les écrans
- 🐳 **Docker ready** - Déployez facilement avec Docker et Docker Compose
- 💾 **Base de données SQLite** - Stockage léger et persistant

## 🚀 Technologies utilisées

- **Backend** : Node.js, Express 5
- **ORM** : Sequelize
- **Base de données** : SQLite 3
- **Template Engine** : EJS
- **Styling** : TailwindCSS 4
- **Conteneurisation** : Docker & Docker Compose

## 📦 Prérequis

- Node.js >= 20.x
- npm >= 9.x
- Docker & Docker Compose (optionnel, pour le déploiement containerisé)

## 🔧 Installation

### Installation locale

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
   
   Créez un fichier `.env` à la racine du projet :
   ```env
   SERVER_PORT=8080
   SQLITE_STORAGE=./recipe-manager.sqlite
   NODE_ENV=development
   ```

4. **Démarrer l'application**
   ```bash
   npm start
   ```

5. **Accéder à l'application**
   
   Ouvrez votre navigateur et accédez à : `http://localhost:8080`

### Installation avec Docker

1. **Cloner le repository**
   ```bash
   git clone https://github.com/Yoshew21/RECIPES-MANAGER.git
   cd RECIPES-MANAGER
   ```

2. **Configurer les variables d'environnement** (optionnel)
   
   Créez un fichier `.env` pour personnaliser le port :
   ```env
   SERVER_PORT=8080
   ```

3. **Lancer avec Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Accéder à l'application**
   
   L'application sera accessible sur : `http://localhost:8080`

5. **Arrêter l'application**
   ```bash
   docker-compose down
   ```

## 📁 Structure du projet

```
RECIPES-MANAGER/
├── app/
│   ├── config/         # Configuration de la base de données
│   ├── controllers/    # Logique métier (recettes, catégories)
│   ├── models/         # Modèles Sequelize (Recipe, Category, etc.)
│   ├── routes/         # Routes Express
│   └── views/          # Templates EJS
├── public/             # Assets statiques (CSS, images)
├── data/               # Dossier pour la base de données SQLite (Docker)
├── docker-compose.yml  # Configuration Docker Compose
├── Dockerfile          # Configuration Docker
├── recipe-manager-run.js  # Point d'entrée de l'application
├── package.json        # Dépendances et scripts npm
└── tailwind.config.js  # Configuration TailwindCSS
```

## 🎯 Utilisation

### Gestion des recettes

1. **Créer une recette** : Cliquez sur "Nouvelle recette" et remplissez le formulaire
2. **Ajouter des ingrédients** : Listez tous les ingrédients nécessaires avec leurs quantités
3. **Définir les étapes** : Détaillez chaque étape de préparation
4. **Ajouter une image** : Uploadez une photo de votre plat
5. **Catégoriser** : Associez la recette à une catégorie

### Recherche et filtrage

- Recherchez par **nom de recette**
- Filtrez par **catégorie**
- Recherchez par **ingrédients**
- Combinez les filtres pour une recherche précise

## 🔒 Base de données

L'application utilise SQLite avec les tables suivantes :
- `recipes` - Informations principales des recettes
- `categories` - Catégories de recettes
- `recipeIngredients` - Liste des ingrédients
- `recipeSteps` - Étapes de préparation
- `recipeTimes` - Temps de préparation et cuisson

## 🐳 Docker & Production

### Healthcheck

L'image Docker inclut un healthcheck qui vérifie que l'application répond correctement sur `/recipes`.

### Volumes

Les données sont persistées dans un volume Docker monté sur `./data` pour garantir la conservation de vos recettes.

### Sécurité

- L'application s'exécute avec un utilisateur non-root
- Les dépendances sont optimisées pour la production
- Le container redémarre automatiquement en cas d'erreur

## 🛠️ Scripts disponibles

```bash
npm start          # Démarre l'application
npm test           # Lance les tests (à implémenter)
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence ISC.

## 👤 Auteur

**Yoshew21**

- GitHub: [@Yoshew21](https://github.com/Yoshew21)

## 🌟 Remerciements

Merci d'utiliser Recipe Manager ! Si vous trouvez ce projet utile, n'hésitez pas à lui donner une étoile ⭐

---

*Développé avec ❤️ et Node.js*
