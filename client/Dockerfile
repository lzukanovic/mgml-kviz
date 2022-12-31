#Step 1
FROM node:16-alpine as build-step
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
ARG configuration=production
RUN npm run build -- --configuration $configuration

# Step 2
FROM nginx:1.23.3-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build-step app/dist/mgml-kviz /usr/share/nginx/html
