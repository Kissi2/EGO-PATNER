# ----------------------------
# 1️⃣ Build Angular
# ----------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Installer deps proprement (meilleur pour CI/CD)
COPY package*.json ./
RUN npm ci

# Copier le projet
COPY . .

# Build Angular en production
RUN npm run build -- --configuration production


# ----------------------------
# 2️⃣ Serve avec Nginx
# ----------------------------
FROM nginx:alpine

# Supprimer config par défaut
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copier notre config nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ⚠️ IMPORTANT : Angular 19 génère généralement ce dossier
COPY --from=builder /app/dist/dashboard_patner/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]