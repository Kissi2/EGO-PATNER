# ----------------------------
# 1️⃣ Build Angular
# ----------------------------
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build -- --configuration production


# ----------------------------
# 2️⃣ Run avec serve
# ----------------------------
FROM node:22-alpine

WORKDIR /app

# installer un serveur statique
RUN npm install -g serve

# copier le build Angular
COPY --from=builder /app/dist/dashboard_partenaire/browser ./dist

EXPOSE 9040

CMD ["serve", "-s", "dist", "-l", "3001"]
