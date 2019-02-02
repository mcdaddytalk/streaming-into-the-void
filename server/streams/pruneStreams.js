import db from '../db';

export default async () => {
  try {
    const result = await db.query(
      "DELETE FROM voids WHERE last_live_at < NOW() - INTERVAL '10 minutes'"
    );
    console.log(`Pruned ${result.rowCount} old streams`);
  } catch (e) {
    console.log('========\nERROR PRUNING\n==========\n', e);
  }
};
