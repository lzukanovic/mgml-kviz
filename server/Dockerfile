FROM node:16-alpine as build-step
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN npm run build

EXPOSE 3070

CMD ["node", "dist/server.bundle.js"]
