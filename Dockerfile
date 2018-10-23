FROM node:8.12-alpine

ENV NODE_ENV production

WORKDIR /usr/src

# BUILD THE APP
RUN mkdir ./client
RUN mkdir ./server
RUN mkdir -p /tmp
RUN mkdir /tmp/pouch

# ENV STUFF
RUN apk --no-cache --virtual build-dependencies add \
    python \
    make \
    g++

# WORK ON CLIENT
WORKDIR /usr/src/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# WORK ON SERVER
WORKDIR /usr/src/server
COPY server/package*.json ./
RUN npm install
COPY server/ ./

RUN apk del build-dependencies

EXPOSE 5000
CMD ["node", "./index"]