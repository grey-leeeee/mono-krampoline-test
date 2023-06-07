# Build stage
FROM node:16 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Run stage
FROM node:16
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/build ./build

# Install serve for serving static files
RUN npm install -g serve
EXPOSE 3000

# Start Nginx and serve
CMD service nginx start && serve -s build
