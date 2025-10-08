const express = require('express');
const router = express.Router();
const nlpService = require('../services/nlpService');
const flightApi = require('../services/flightApi');
const hotelApi = require('../services/hotelApi');

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

module.exports = router;
