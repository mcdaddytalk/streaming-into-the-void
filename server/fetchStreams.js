const request = require('request-promise-native');

const {Voids} = require('./db');

const addVoid = async (stream) => {
  const _id = stream.id // a particular stream: a user ID and a created at

  const newDoc = {
    _id,
    'type': 'stream',
    // 'random': Math.random(),
    'created_at': Date.now(),
    'user_id': stream.user_id,
    'title': stream.title,
    'started_at': stream.started_at,
    'language': stream.language,
    'thumbnail_url': stream.thumbnail_url,
    'viewers': stream.viewer_count
  };

  Voids.upsert(_id, (oldDoc) => {
    return newDoc;
  }).catch(e => console.log(e));
}

// make one call and receive up to 100 streams from Twitch API
// returns json.data (streams)
// returns json.pagination (new cursor)
const fetchStreams = async (cursor, token) => {
  // set up call
  let options = {
    uri: 'https://api.twitch.tv/helix/streams?first=100&language=en&after='
    + (cursor ? cursor : '') + '&game_id=417752&game_id=509671&game_id=509672&game_id=26936&game_id=509659&game_id=509673&game_id=509658&game_id=509670&game_id=509669&game_id=509667&game_id=509663',
    headers: {
      'Authorization': 'Bearer ' + token
    },
    json: true
  }
  // fetch and return data
  try {
    const response = await request(options);
    return response;
  } catch(e) {
    console.error('==> Could not fetch streams at cursor', cursor, e.message);
    return e;
  }
}

const filterStreams = async (streams) => {
  let count = 0;
  for(const stream of streams) {
    // filter out streams
    if(stream && stream.viewer_count < 2 && stream.type === 'live') {
      // add stream to db
      addVoid(stream);
      count++;
    }
  }
  return count;
}

// grab many streams in a batch of up to 120 calls.
const fetchBatch = async (token, cursor) => {
  let batchSize = 120;

  let stats = {
    began: Date.now(), 
    calls: 0,
    voids: 0
  }

  try {
    console.log('!!!! Starting a batch at', cursor);

    for(let i = 0; i < batchSize; i++) {
      // grab streams.
      let streams = await fetchStreams(cursor, token);

      // check for error object
      if(streams.error) {
        console.error(`==> Bad response received (${streams.error.status}): ${streams.error.error}`);
        break;
      }

      // filter streams
      stats.voids = await filterStreams(streams.data);

      // update the cursor
      cursor = (streams.data.length > 0
        ? streams.pagination.cursor
        : null);
      
      stats.calls++;
    }
  } catch(e) {
    console.error('==> Fetching streams failed', cursor, e);
  } finally {
    console.log(`==> Finished batch.\n${stats.voids} voids\n${stats.calls} calls`);

    // trigger a re-index
    await Voids.find({
      selector: {
        created_at: {
          $gte: stats.began
        }
      },
      sort: ['created_at'],
      limit: 1
    });

    return {...stats, cursor};
  }
}

module.exports = {fetchBatch};