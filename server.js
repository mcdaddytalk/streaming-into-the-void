const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const fetchStreams = require('./fetchStreams');

const app = express();
const port = process.env.PORT || 5000;

const {PouchDB} = require('./db');
const Config = require('./config.json');

// cron job for fetcher
let batchNum = 0;
const schedule = cron.schedule(
  '* * * * *',
  async () => {
    batchNum++;
    let token = (batchNum % 2
      ? Config.token.access_token
      : Config.alternate_token.access_token);
    console.log('Scheduled batch', batchNum, token);
    await fetchStreams.fetchBatch(token);
  },
  { scheduled: false }
);
schedule.start();

// add db route
app.use('/', cors(), require('express-pouchdb')(PouchDB));

// server live
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});