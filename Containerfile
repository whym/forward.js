# syntax=docker/dockerfile:1
FROM docker.io/node:24-trixie

WORKDIR /usr/src/app
COPY package*.json tsconfig.json ./
RUN npm ci --ignore-scripts # to delay tsc
COPY . .
RUN npm ci

CMD [ "npm", "run", "start" ]
