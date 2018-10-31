const { Voids } = require('./db');

const AGE_MIN = 1000 * 60 * 10; // 10 minutes in milliseconds

const prune = async () => {
  try {
    let dateMin = Date.now() - AGE_MIN;

    console.log('Beginning prune', dateMin);
    let response = await Voids.find({
      selector: {
        created_at: { $lt: dateMin }
      },
      fields: ['_id', '_rev']
    });
    let docsToDelete = response.docs;

    if (docsToDelete.length > 0) {
      // add deleted flag to every doc
      let deletedDocs = docsToDelete.map(doc => ({ ...doc, _deleted: true }));

      // "delete" them from the database
      Voids.bulkDocs(deletedDocs, err => {
        if (err) return console.log(err);
        console.log('==> Pruned', deletedDocs.length);
      });
    } else {
      console.log('==> Nothing to prune');
    }
  } catch (e) {
    console.log("========\nERROR PRUNING\n==========\n", docstoDelete, "\n==========\n", e);
  }
};

module.exports = { prune };
