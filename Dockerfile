# Stage 1: build the TypeScript code
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Install dependencies (including devDeps)
COPY package*.json tsconfig.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: runtime image
FROM node:22-alpine AS runtime

WORKDIR /usr/src/app

# Copy only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled output
COPY --from=builder /usr/src/app/dist ./dist

# Optionally include .env or other assets
# COPY .env ./

# EXPOSE 8000
CMD ["node", "dist/index.js"]