# syntax=docker/dockerfile:1
FROM node:20-alpine

WORKDIR /usr/src/app
COPY package*.json tsconfig.json ./
RUN npm install --ignore-scripts # to delay tsc
COPY . .
RUN npm ci

CMD [ "npm", "run", "start" ]
