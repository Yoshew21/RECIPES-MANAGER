FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev && npm cache clean --force

COPY . .

EXPOSE 8080

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

ENV NODE_ENV=production
ENV SERVER_PORT=8080

CMD ["sh", "-c", "./node_modules/.bin/sequelize db:migrate && node recipe-manager-run.js"]
