const PouchDB = require('pouchdb-node').defaults({
  auto_compaction: true,
  adapter: 'memory'
});

// add plugins
PouchDB.plugin(require('pouchdb-erase'));
PouchDB.plugin(require('pouchdb-find'));
PouchDB.plugin(require('pouchdb-upsert'));
PouchDB.plugin(require('pouchdb-adapter-memory'));

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

module.exports = {
  Voids,
  PouchDB
};