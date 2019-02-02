import Router from 'express-promise-router';
import db from '../db';

const router = new Router();

router.get('/', (req, res) => {
  res.json({ hello: 'goodbye' });
});

router.post('/', async (req, res) => {
  try {
    const { seen_stream_ids, count } = req.body;
    const streams = await db.query(
      "SELECT * FROM voids \
      WHERE last_live_at > NOW() - INTERVAL '5 minutes' \
            AND stream_id NOT IN ($1) \
      ORDER BY random() \
      LIMIT $2",
      [seen_stream_ids, !count || count < 5 || count > 20 ? 8 : count]
    );
    return res.json(streams.rows);
  } catch (e) {
    console.log('====== Error serving streams', e);
    res.status(500);
    res.json({ error: "Sorry, couldn't resolve this" });
  }
});

export default router;
