# Build stage
FROM krmp-d2hub-idock.9rum.cc/goorm/node:16 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Run stage
FROM krmp-d2hub-idock.9rum.cc/goorm/node:16
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/build ./build

# apt 프록시 설정
RUN touch /etc/apt/apt.conf.d/proxy.conf
RUN echo "Acquire::http::Proxy \"http://krmp-proxy.9rum.cc:3128/\";" > /etc/apt/apt.conf.d/proxy.conf

# Install and setup Nginx
RUN apt-get update && \
    apt-get install -y nginx && \
    rm -rf /var/lib/apt/lists/* && \
    rm /etc/nginx/sites-enabled/default
COPY default.conf /etc/nginx/conf.d/

# Install serve for serving static files
RUN npm install -g serve
EXPOSE 80

# Start Nginx and serve
CMD service nginx start && serve -s build