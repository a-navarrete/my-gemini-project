import express from 'express';
import bookingOrchestratorAgent from '../agents/bookingOrchestratorAgent.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const bookingDetails = req.body;

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
