const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');
const fetchStreams = require('./fetchStreams');

const app = express();
const port = process.env.PORT || 5000;

const {PouchDB} = require('./db');
const Config = require('./config.json');

const tmpPath = process.env.NODE_ENV === 'production'
  ? '/tmp'
  : __dirname + '/tmp';

// cron job for fetcher
let batchNum = 0;
let cursor = null;
const schedule = cron.schedule(
  '* * * * *',
  async () => {
    batchNum++;
    let token = (batchNum % 2
      ? Config.token.access_token
      : Config.alternate_token.access_token);
    console.log('Scheduled batch', batchNum, token);
    let result = await fetchStreams.fetchBatch(token, cursor);
    cursor = result.cursor;
  },
  { scheduled: false }
);
schedule.start();

// Serve any static files
app.use(express.static(path.join(__dirname, '../client/build')));

// add db route
app.use('/db', cors(), require('express-pouchdb')(PouchDB, {
  inMemoryConfig: true,
  logPath: tmpPath + '/log.txt'
}));

// Handle React routing, return all requests to React app
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// server live
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});