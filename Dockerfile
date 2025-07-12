# Stage 1: Dependencies and Build
FROM node:lts-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile # Install all dependencies, including dev
COPY . .
RUN npm run build

# Stage 2: Production Runner
FROM node:lts-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Copy only production dependencies
COPY --from=builder /app/package.json ./package.json
RUN npm install --production --frozen-lockfile
# Copy build output and static assets
COPY --from=builder /app/.next ./.next

# If you have a custom server.js or similar, copy it here
# COPY --from=builder /app/server.js ./server.js

EXPOSE 3000
CMD ["npm", "start"]
