/**
 * @typedef {import('./flightAgent.js').Flight} Flight
 * @typedef {import('./hotelAgent.js').Hotel} Hotel
 */

/**
 * @typedef {Object} TravelPackage
 * @property {string} id
 * @property {string} name
 * @property {Flight} flight
 * @property {Hotel} hotel
 * @property {number} totalPrice
 * @property {'Good deal' | 'Stable' | null} priceTrend
 */

/**
 * @typedef {Object} PackagingAgent
 * @property {string} role
 * @property {string} goal
 * @property {(flights: Flight[], hotels: Hotel[]) => TravelPackage[]} execute
 */

/**
 * A simple packaging agent that pairs flights and hotels.
 * For the MVP, it creates a few simple packages.
 * @type {PackagingAgent}
 */
const packagingAgent = {
  role: 'Travel Package Assembler',
  goal: 'Combine individual flight and hotel options into attractive travel packages.',
  execute: (flights = [], hotels = []) => {
    if (!flights.length || !hotels.length) {
      return [];
    }

    const packages = [];
    // For simplicity, let's create up to 3 packages by pairing the first few flights and hotels.
    const numPackages = Math.min(flights.length, hotels.length, 3);

    for (let i = 0; i < numPackages; i++) {
      const flight = flights[i];
      const hotel = hotels[i];

      // Mocked price trend logic
      const priceTrend = Math.random() > 0.5 ? 'Good deal' : 'Stable';

      packages.push({
        id: `pkg-${flight.id}-${hotel.id}`,
        name: `Trip to ${hotel.location}`,
        flight,
        hotel,
        totalPrice: flight.price + hotel.pricePerNight, // Assuming a 1-night stay for MVP
        priceTrend,
      });
    }

    return packages;
  },
};

export default packagingAgent;
