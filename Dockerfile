# Utiliser une image Node.js LTS
FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration des dépendances
COPY package.json package-lock.json ./

# Installer les dépendances (production uniquement)
RUN npm ci --only=production && npm cache clean --force

# Copier le code de l'application (exclut node_modules grâce à .dockerignore)
COPY . .

# Créer le répertoire data et déplacer la DB existante si elle est à la racine
RUN mkdir -p /app/data && \
    if [ -f recipe-manager.sqlite ]; then mv recipe-manager.sqlite /app/data/recipe-manager.sqlite; fi

# Exposer le port de l'application
EXPOSE 8080

# Utiliser un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app && \
    chmod 777 /app/data

USER nodejs

# Variable d'environnement par défaut
ENV NODE_ENV=production
ENV SERVER_PORT=8080
ENV SQLITE_STORAGE=/app/data/recipe-manager.sqlite

# Commande de démarrage
CMD ["node", "recipe-manager-run.js"]

