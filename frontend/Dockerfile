# Multi-stage build for optimized production image

# Stage 1: Builder
FROM node:20-slim as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies needed for build)
RUN npm ci --ignore-scripts

# Copy application code
COPY . .

# Build the application
# API URL will be injected at runtime via environment variable
RUN npm run build

# Stage 2: Runtime (nginx to serve static files)
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Create a script to inject environment variables at runtime
RUN echo '#!/bin/sh' > /docker-entrypoint.d/40-inject-env.sh && \
    echo 'echo "window.ENV = { VITE_API_URL: \"${API_URL}\" };" > /usr/share/nginx/html/env-config.js' >> /docker-entrypoint.d/40-inject-env.sh && \
    chmod +x /docker-entrypoint.d/40-inject-env.sh

# Expose port
EXPOSE 80

# nginx will start automatically via base image entrypoint
