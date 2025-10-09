const hotels = {
  london: [
    { id: 1, name: 'The Savoy', location: 'London', pricePerNight: 400 },
    { id: 2, name: 'The Ritz', location: 'London', pricePerNight: 450 },
  ],
  paris: [
    { id: 3, name: 'Le Bristol', location: 'Paris', pricePerNight: 800 },
  ],
};

export function getHotels(destination) {
  if (typeof destination !== 'string') {
    return [];
  }

  const normalizedDestination = destination.trim().toLowerCase();
  return hotels[normalizedDestination] || [];
}

export default { getHotels };
