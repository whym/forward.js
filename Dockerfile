# syntax=docker/dockerfile:1
FROM node:18

WORKDIR /usr/src/app
COPY package*.json tsconfig.json ./
RUN npm install --ignore-scripts # skip tsc here
COPY . .
RUN npm ci

CMD [ "npm", "run", "start" ]
