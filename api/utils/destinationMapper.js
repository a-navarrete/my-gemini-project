const cityToIataCode = {
  london: 'LHR', // London Heathrow
  paris: 'CDG',  // Paris Charles de Gaulle
  madrid: 'MAD', // Madrid Barajas
  newyork: 'NYC', // New York City (generic, could be JFK, LGA, EWR)
  tokyo: 'HND',  // Tokyo Haneda
  rome: 'FCO',   // Rome Fiumicino
  berlin: 'BER', // Berlin Brandenburg
  dubai: 'DXB',  // Dubai International
  sydney: 'SYD', // Sydney Kingsford Smith
  losangeles: 'LAX',// Los Angeles International
  'los angeles': 'LAX',
  // Add more mappings as needed
};

const cityToHotelbedsCode = {
  london: 'LON', // Example Hotelbeds code for London
  paris: 'PAR',  // Example Hotelbeds code for Paris
  madrid: 'MAD', // Example Hotelbeds code for Madrid
  newyork: 'NYC', // Example Hotelbeds code for New York
  tokyo: 'TYO',  // Example Hotelbeds code for Tokyo
  rome: 'ROM',   // Example Hotelbeds code for Rome
  berlin: 'BER', // Example Hotelbeds code for Berlin
  dubai: 'DXB',  // Example Hotelbeds code for Dubai
  sydney: 'SYD', // Example Hotelbeds code for Sydney
  losangeles: 'LAX',
  'los angeles': 'LAX',
   // Add more mappings as needed
};

export function getIataCode(city) {
  return cityToIataCode[city.toLowerCase()] || null;
}

export function getHotelbedsCode(city) {
  return cityToHotelbedsCode[city.toLowerCase()] || null;
}
