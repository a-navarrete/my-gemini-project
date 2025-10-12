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
 * @property {(destination: string) => Hotel[]} execute - The function to execute the agent's task.
 */

const hotels = {
  london: [
    { id: 1, name: 'The Savoy', location: 'London', pricePerNight: 400 },
    { id: 2, name: 'The Ritz', location: 'London', pricePerNight: 450 },
  ],
  paris: [
    { id: 3, name: 'Le Bristol', location: 'Paris', pricePerNight: 800 },
  ],
};

/** @type {HotelAgent} */
const hotelAgent = {
  role: 'Accommodation Specialist',
  goal: 'Find available hotels based on given parameters.',
  execute: (destination) => {
    if (typeof destination !== 'string') {
      return [];
    }

    const normalizedDestination = destination.trim().toLowerCase();
    return hotels[normalizedDestination] || [];
  }
};

export default hotelAgent;
