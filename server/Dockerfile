FROM node:10.12-alpine

# Create files for pouch db
RUN mkdir -p /tmp/pouch
RUN touch /tmp/log.txt

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