import axios from 'axios';
import { getIataCode } from '../utils/destinationMapper.js'; // New import

/**
 * @typedef {Object} Flight
 * @property {number} id
 * @property {string} airline
 * @property {string} flightNumber
 * @property {string} from
 * @property {string} to
 * @property {number} price
 */

/**
 * @typedef {Object} FlightAgent
 * @property {string} role - The role of the agent.
 * @property {string} goal - The goal of the agent.
 * @property {(destination: string) => Promise<Flight[]>} execute - The function to execute the agent's task.
 */

const getAmadeusToken = async () => {
  const { AMADEUS_API_KEY, AMADEUS_API_SECRET } = process.env;
  if (!AMADEUS_API_KEY || !AMADEUS_API_SECRET) {
    throw new Error('Amadeus API key or secret not provided.');
  }

  const response = await axios.post(
    'https://test.api.amadeus.com/v1/security/oauth2/token',
    `grant_type=client_credentials&client_id=${AMADEUS_API_KEY}&client_secret=${AMADEUS_API_SECRET}`,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return response.data.access_token;
};

const normalizeAmadeusResponse = (data) => {
  return data.map((offer, index) => {
    const firstItinerary = offer.itineraries[0];
    const firstSegment = firstItinerary.segments[0];
    return {
      id: offer.id || index,
      airline: firstSegment.carrierCode, // This is an airline code, not the full name
      flightNumber: `${firstSegment.carrierCode} ${firstSegment.number}`,
      from: firstSegment.departure.iataCode,
      to: firstSegment.arrival.iataCode,
      price: parseFloat(offer.price.total),
    };
  });
};

/** @type {FlightAgent} */
const flightAgent = {
  role: 'Flight Options Specialist',
  goal: 'Find available flights based on given parameters.',
  execute: async (destination) => {
    if (typeof destination !== 'string') {
      return [];
    }

    const iataCode = getIataCode(destination);
    if (!iataCode) {
      console.warn(`No IATA code found for destination: ${destination}`);
      return [];
    }

    try {
      const token = await getAmadeusToken();
      const today = new Date().toISOString().split('T')[0];

      const response = await axios.get(
        'https://test.api.amadeus.com/v2/shopping/flight-offers',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            originLocationCode: 'NYC',
            destinationLocationCode: iataCode,
            departureDate: today,
            adults: 1,
          },
        }
      );

      return normalizeAmadeusResponse(response.data.data);
    } catch (error) {
      console.error('Amadeus API request failed', error);
      return [];
    }
  }
};

export default flightAgent;