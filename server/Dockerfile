FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production

# Install dependencies first so Docker can cache this layer.
COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY . .
RUN mkdir -p /app/uploads && chown -R node:node /app/uploads && chmod +x docker-entrypoint.sh

USER node
EXPOSE 8000
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "src/index.js"]
