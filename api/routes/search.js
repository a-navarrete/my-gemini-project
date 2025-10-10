import express from 'express';
const router = express.Router();
import nlpService from '../services/nlpService.js';
import flightApi from '../services/flightApi.js';
import hotelApi from '../services/hotelApi.js';

router.post('/', (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  const { destination } = nlpService.parseQuery(query);

  if (!destination) {
    return res.json({ flights: [], hotels: [] });
  }

  const flights = flightApi.getFlights(destination);
  const hotels = hotelApi.getHotels(destination);

  res.json({ flights, hotels });
});

export default router;
