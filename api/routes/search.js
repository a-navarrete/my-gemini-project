import express from 'express';
import bookingOrchestratorAgent from '../agents/bookingOrchestratorAgent.js';

const router = express.Router();

router.post('/', async (req, res) => {
  console.log('Search route hit!');
  if (!req.is('application/json')) {
    return res.status(415).json({ error: 'Content-Type must be application/json' });
  }

  const { query } = req.body || {};
  if (typeof query !== 'string') {
    return res.status(400).json({ error: 'Query must be a string' });
  }

  const normalizedQuery = query.trim();
  if (!normalizedQuery) {
    return res.status(400).json({ error: 'Query is required' });
  }

  if (normalizedQuery.length > 200) {
    return res.status(400).json({ error: 'Query is too long' });
  }

  try {
    const result = await bookingOrchestratorAgent.search(normalizedQuery);
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
