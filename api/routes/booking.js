import express from 'express';
const router = express.Router();
import { readDb, writeDb } from '../db.js';

router.post('/', async (req, res) => {
  const { flight, hotel, user, payment } = req.body;
  if (!flight || !hotel || !user || !payment) {
    return res.status(400).json({ error: 'Missing booking information' });
  }

  const db = await readDb();
  db.bookings.push(req.body);
  await writeDb(db);

  res.json({ success: true, message: 'Booking successful' });
});

export default router;
