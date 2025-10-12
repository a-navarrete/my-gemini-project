import express from 'express';
import nlpService from '../services/nlpService.js';
import flightApi from '../services/flightApi.js';
import hotelApi from '../services/hotelApi.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    const { destination } = await nlpService.parseQuery(query);

    if (!destination) {
      return res.json({ flights: [], hotels: [] });
    }

    const [flights = [], hotels = []] = await Promise.all([
      flightApi.getFlights(destination),
      hotelApi.getHotels(destination),
    ]);

    return res.json({ flights, hotels });
  } catch (error) {
    console.error('Search request failed', error);
    return res.status(500).json({ error: 'Unable to process search request' });
  }
});

export default router;
