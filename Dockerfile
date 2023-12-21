# ---- Base Node ----
FROM node:18-alpine AS base
WORKDIR /app
COPY package.json ./
COPY .env ./

# ---- Dependencies ----
FROM base AS dependencies
RUN npm install
# ---- Copy Files/Build ----
FROM dependencies AS build
COPY . .
RUN npm run build

# --- Release ----
FROM node:18-alpine AS release
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/.env ./.env
EXPOSE 3000
CMD ["node", "dist/main"]