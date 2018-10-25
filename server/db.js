console.log(`environment: ${process.env.NODE_ENV}`);

const tmpPath = process.env.NODE_ENV === 'production'
  ? '/tmp'
  : __dirname + '/tmp';
  
const PouchDB = require('pouchdb-node').defaults({
  prefix: tmpPath + '/pouch/',
  auto_compaction: true
});

// add plugins
PouchDB.plugin(require('pouchdb-erase'));
PouchDB.plugin(require('pouchdb-find'));
PouchDB.plugin(require('pouchdb-upsert'));

const Voids = new PouchDB('voids');

Voids.erase()
.then(() => {
  Voids.createIndex({
    index: {
      fields: ['created_at']
    }
  });
})
.catch(e => console.log(e));

Voids.info().then(info => console.log(info));

module.exports = {
  Voids,
  PouchDB
};