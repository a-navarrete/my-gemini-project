import express from 'express';
import bookingOrchestratorAgent from '../agents/bookingOrchestratorAgent.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    const result = await bookingOrchestratorAgent.search(query);
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json({ error: result.message });
    }
  } catch (error) {
    console.error('Search request failed', error);
    res.status(500).json({ error: 'Unable to process search request' });
  }
});

export default router;
