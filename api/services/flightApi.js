const flights = {
  london: [
    { id: 1, airline: 'British Airways', flightNumber: 'BA2490', from: 'NYC', to: 'LHR', price: 550 },
    { id: 2, airline: 'Virgin Atlantic', flightNumber: 'VS4', from: 'NYC', to: 'LHR', price: 600 },
  ],
  paris: [
    { id: 3, airline: 'Air France', flightNumber: 'AF007', from: 'NYC', to: 'CDG', price: 580 },
  ],
};

function getFlights(destination) {
  return flights[destination.toLowerCase()] || [];
}

module.exports = { getFlights };
