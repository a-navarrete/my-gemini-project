import express from 'express';
import { readDb, writeDb } from '../db.js';

const router = express.Router();

function validateBookingPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return 'A booking payload object is required.';
  }

  const { flight, hotel, user, payment } = payload;

  if (!flight || typeof flight !== 'object') {
    return 'Flight details are required.';
  }

  if (!hotel || typeof hotel !== 'object') {
    return 'Hotel details are required.';
  }

  if (!user || typeof user !== 'object') {
    return 'User details are required.';
  }

  if (!payment || typeof payment !== 'object') {
    return 'Payment details are required.';
  }

  return null;
}

router.post('/', async (req, res) => {
  const bookingDetails = req.body;
  const validationError = validateBookingPayload(bookingDetails);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const database = await readDb();
    const bookings = Array.isArray(database.bookings) ? database.bookings : [];
    const updatedBookings = [...bookings, bookingDetails];
    const updatedDatabase = { ...database, bookings: updatedBookings };

    await writeDb(updatedDatabase);

    return res.status(200).json({ success: true, message: 'Booking successful' });
  } catch (error) {
    console.error('Failed to persist booking', error);
    return res.status(500).json({ error: 'Failed to save booking' });
  }
});

export default router;
