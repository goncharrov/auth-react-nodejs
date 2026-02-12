FROM node:22-alpine

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Устанавливаем sequelize-cli (CLI нужен в рантайме)
RUN npm install -g sequelize-cli

# Copy package files
COPY package*.json ./

# Install production dependencies only
# npm install used instead of npm ci to avoid OOM/kill (exit 146) in constrained build env
RUN npm install --omit=dev --no-audit --no-fund

# Copy application code
COPY . .

# Expose port 5005
EXPOSE 5005

# Start the server
CMD ["node", "index.js"]
