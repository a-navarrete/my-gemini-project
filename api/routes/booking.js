import express from 'express';
import bookingOrchestratorAgent from '../agents/bookingOrchestratorAgent.js';

const router = express.Router();

router.post('/', async (req, res) => {
  if (!req.is('application/json')) {
    return res.status(415).json({ error: 'Content-Type must be application/json' });
  }

  const bookingDetails = req.body;
  if (!bookingDetails || typeof bookingDetails !== 'object' || Array.isArray(bookingDetails)) {
    return res.status(400).json({ error: 'Booking payload must be an object' });
  }

  try {
    const result = await bookingOrchestratorAgent.book(bookingDetails);
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('Booking request failed', error);
    res.status(500).json({ error: 'Unable to process booking request' });
  }
});

export default router;
