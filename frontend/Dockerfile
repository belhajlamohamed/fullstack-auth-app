# --- Étape 1 : Build du code React ---
# On passe à la version 20 (LTS) pour satisfaire les exigences de Vite
FROM node:20-alpine AS build-stage
WORKDIR /app

# On copie les fichiers de dépendances
COPY package*.json ./

# Nettoyage et installation propre pour éviter l'erreur "native binding"
RUN npm ci

# Copie du reste du code
COPY . .

# Injection de la variable d'environnement
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Création du dossier /dist
RUN npm run build

# ... après le build de ton app React ...
FROM nginx:stable-alpine
# Copie ton fichier de config personnalisé
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copie les fichiers buildés de React
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]