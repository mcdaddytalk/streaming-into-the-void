const express = require('express');
const cors = require('cors');
const fetchStreams = require('./fetchStreams');
const pruneStreams = require('./pruneStreams');

const app = express();
const port = process.env.PORT || 5000;

const { PouchDB } = require('./db');
const Config = require('./config.json');

const tmpPath =
  process.env.NODE_ENV === 'production' ? '/tmp' : __dirname + '/tmp';

// cron job for fetcher
let batchNum = 0;
let cursor = null;

setInterval(async () => {
  batchNum++;

  // every 5th batch, clear out old streams.
  if (batchNum % 5 === 0) {
    pruneStreams.prune();
  }

  // load more streams
  let token =
    batchNum % 2
      ? Config.token.access_token
      : Config.alternate_token.access_token;
  console.log('Scheduled batch', batchNum, token);
  let result = await fetchStreams.fetchBatch(token, cursor);
  cursor = result.cursor;
}, 1000 * 60);

// add db route
app.use(
  '/',
  cors(),
  require('express-pouchdb')(PouchDB, {
    logPath: tmpPath + '/log.txt',
    configPath: tmpPath + '/pouchdb-config.json'
  })
);

// server live
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
