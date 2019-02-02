import express from 'express';
import bodyParser from 'body-parser';
import router from './api';
import cors from 'cors';
import fetchStreams from './streams/fetchStreams';
import pruneStreams from './streams/pruneStreams';
import Config from './config.json';

const app = express();
const port = process.env.PORT || 5000;

// Recursive scraper.
const runBatch = async (token, batchNum, cursor) => {
  console.log(`Starting Batch #${batchNum} at ${cursor}`);
  try {
    // every 5th batch, clear out old streams.
    if (batchNum % 5 === 0) {
      await pruneStreams();
    }

    // grab streams
    const result = await fetchStreams(token, cursor);
    cursor = result.cursor;
  } catch (e) {
    console.log('========\nERROR FETCHING STREAMS\n==========\n', e);
  }

  // THE SHOW MUST GO ON!!!
  setTimeout(() => runBatch(token, batchNum + 1, cursor), 1000 * 60);
};

// Begin running batches at num 0 with no cursor.
runBatch(Config.token.access_token, 0, null);

// server live
app.use(cors());
app.use(bodyParser.json());
app.use(router);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
