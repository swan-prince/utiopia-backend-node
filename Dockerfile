FROM node:10-alpine as builder
RUN mkdir -p /app
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN node migration.js up
RUN npm start
