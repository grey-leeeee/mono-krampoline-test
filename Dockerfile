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

# Install and setup Nginx
RUN apt-get update && \
    apt-get install -y nginx && \
    rm -rf /var/lib/apt/lists/* && \
    rm /etc/nginx/sites-enabled/default
COPY default.conf /etc/nginx/conf.d/

# Install serve for serving static files
RUN npm install -g serve
EXPOSE 3000

# Start Nginx and serve
CMD service nginx start && serve -s build
