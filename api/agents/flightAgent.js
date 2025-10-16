import axios from 'axios';

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

const resolveDestinationCode = (value) => {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (/^[A-Z]{3}$/i.test(trimmed)) {
    return trimmed.toUpperCase();
  }

  return null;
};

/** @type {FlightAgent} */
const flightAgent = {
  role: 'Flight Options Specialist',
  goal: 'Find available flights based on given parameters.',
  backstory: 'An expert in querying flight data, specialized in finding the best flight options from various APIs.',
  execute: async (destination) => {
    const destinationCode = resolveDestinationCode(destination);
    if (!destinationCode) {
      console.warn(`No valid IATA code provided for destination: ${destination}`);
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
            destinationLocationCode: destinationCode,
            departureDate: today,
            adults: 1,
          },
        }
      );

      return normalizeAmadeusResponse(response.data.data);
    } catch (error) {
      const status = error.response?.status;
      const statusText = error.response?.statusText;
      console.error(
        'Amadeus API request failed',
        status ? `${status} ${statusText || ''}`.trim() : error.message
      );
      return [];
    }
  }
};

export default flightAgent;
