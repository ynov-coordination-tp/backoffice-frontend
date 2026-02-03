FROM node:20-alpine

WORKDIR /app

# dépendances (cache Docker)
COPY package*.json ./
RUN npm ci

# code
COPY . .

EXPOSE 5173

# SvelteKit dev server accessible depuis l'hôte
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
