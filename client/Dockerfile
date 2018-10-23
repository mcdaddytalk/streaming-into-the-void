FROM node:10.12-alpine

WORKDIR /usr/src

COPY package.json .
COPY package-lock.json .

RUN apk --no-cache --virtual build-dependencies add \
    python \
    make \
    g++ \
    && npm install \
    && apk del build-dependencies

COPY . .

RUN npm run build
RUN mv ./build /public