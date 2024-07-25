# syntax=docker/dockerfile:1
USER node
FROM docker.io/node:20-bookworm

WORKDIR /usr/src/app
COPY package*.json tsconfig.json ./
RUN npm install --ignore-scripts # to delay tsc
COPY . .
RUN npm ci

CMD [ "npm", "run", "start" ]
