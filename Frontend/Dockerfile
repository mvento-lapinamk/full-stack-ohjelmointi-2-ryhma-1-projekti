# syntax=docker/dockerfile:1
ARG NODE_VERSION=22.20.0

# Build stage
FROM node:${NODE_VERSION}-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Runtime stage (nginx)
FROM nginx:1.27-alpine AS final
# Serve the static build output
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
