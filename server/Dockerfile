FROM node:10.12-alpine

# Set up PouchDB in /tmp/
RUN mkdir -p /tmp/pouch
RUN touch /tmp/log.txt
COPY pouchdb-config.json /tmp/

WORKDIR /usr/src

ENV NODE_ENV=production

COPY package.json .
COPY package-lock.json .

RUN apk --no-cache --virtual build-dependencies add \
    python \
    make \
    g++ \
    && npm install \
    && apk del build-dependencies

COPY . .

EXPOSE 5000

CMD ["npm", "start"]