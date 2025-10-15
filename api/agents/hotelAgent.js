import axios from 'axios';
import crypto from 'crypto';
import { getHotelbedsCode } from '../utils/destinationMapper.js'; // New import

/**
 * @typedef {Object} Hotel
 * @property {number} id
 * @property {string} name
 * @property {string} location
 * @property {number} pricePerNight
 */

/**
 * @typedef {Object} HotelAgent
 * @property {string} role - The role of the agent.
 * @property {string} goal - The goal of the agent.
 * @property {(destination: string) => Promise<Hotel[]>} execute - The function to execute the agent's task.
 */

const generateXSignature = (apiKey, apiSecret) => {
  const timestamp = Math.floor(Date.now() / 1000); // Unix timestamp in seconds
  const signature = crypto.createHash('sha256').update(apiKey + apiSecret + timestamp).digest('hex');
  return signature;
};

const normalizeHotelbedsResponse = (data) => {
  return data.map((hotel, index) => ({
    id: hotel.code || index,
    name: hotel.name,
    location: hotel.destinationName,
    pricePerNight: parseFloat(hotel.minRate),
  }));
};

/** @type {HotelAgent} */
const hotelAgent = {
  role: 'Accommodation Specialist',
  goal: 'Find available hotels based on given parameters.',
  execute: async (destination) => {
    if (typeof destination !== 'string') {
      return [];
    }

    const hotelbedsCode = getHotelbedsCode(destination);
    if (!hotelbedsCode) {
      console.warn(`No Hotelbeds code found for destination: ${destination}`);
      return [];
    }

    try {
      const { HOTELBEDS_API_KEY, HOTELBEDS_API_SECRET } = process.env;
      if (!HOTELBEDS_API_KEY || !HOTELBEDS_API_SECRET) {
        throw new Error('Hotelbeds API key or secret not provided.');
      }

      const xSignature = generateXSignature(HOTELBEDS_API_KEY, HOTELBEDS_API_SECRET);

      const response = await axios.post(
        'https://api.test.hotelbeds.com/hotel-api/1.0/hotels',
        {
          stay: {
            checkIn: new Date().toISOString().split('T')[0],
            checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          },
          occupancies: [{
            rooms: 1,
            adults: 1,
            children: 0
          }],
          destination: {
            code: hotelbedsCode,
          },
          language: "ENG",
          currency: "USD"
        },
        {
          headers: {
            'Api-Key': HOTELBEDS_API_KEY,
            'X-Signature': xSignature,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );

      return normalizeHotelbedsResponse(response.data.hotels.hotels);
    } catch (error) {
      console.error('Hotelbeds API request failed', error);
      return [];
    }
  }
};

export default hotelAgent;
