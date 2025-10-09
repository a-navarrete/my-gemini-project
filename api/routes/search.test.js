import request from 'supertest';
import express from 'express';
import searchRouter from './search.js';
import nlpService from '../services/nlpService.js';
import flightApi from '../services/flightApi.js';
import hotelApi from '../services/hotelApi.js';

// Mock the services
jest.mock('../services/nlpService.js');
jest.mock('../services/flightApi.js');
jest.mock('../services/hotelApi.js');

const app = express();
app.use(express.json());
app.use('/api/search', searchRouter);

describe('POST /api/search', () => {
  beforeEach(() => {
    // Reset mocks before each test
    nlpService.parseQuery.mockReset();
    flightApi.getFlights.mockReset();
    hotelApi.getHotels.mockReset();
  });

  test('should return flights and hotels for a valid query', async () => {
    nlpService.parseQuery.mockReturnValue({ destination: 'London' });
    flightApi.getFlights.mockReturnValue([{ id: 'F1', city: 'London' }]);
    hotelApi.getHotels.mockReturnValue([{ id: 'H1', city: 'London' }]);

    const response = await request(app)
      .post('/api/search')
      .send({ query: 'flights to London' });

    expect(response.statusCode).toBe(200);
    expect(response.body.flights).toEqual([{ id: 'F1', city: 'London' }]);
    expect(response.body.hotels).toEqual([{ id: 'H1', city: 'London' }]);
    expect(nlpService.parseQuery).toHaveBeenCalledWith('flights to London');
    expect(flightApi.getFlights).toHaveBeenCalledWith('London');
    expect(hotelApi.getHotels).toHaveBeenCalledWith('London');
  });

  test('should return 400 if query is missing', async () => {
    const response = await request(app)
      .post('/api/search')
      .send({});

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Query is required');
    expect(nlpService.parseQuery).not.toHaveBeenCalled();
  });

  test('should return empty arrays if no destination is parsed', async () => {
    nlpService.parseQuery.mockReturnValue({});

    const response = await request(app)
      .post('/api/search')
      .send({ query: 'invalid query' });

    expect(response.statusCode).toBe(200);
    expect(response.body.flights).toEqual([]);
    expect(response.body.hotels).toEqual([]);
    expect(nlpService.parseQuery).toHaveBeenCalledWith('invalid query');
    expect(flightApi.getFlights).not.toHaveBeenCalled();
    expect(hotelApi.getHotels).not.toHaveBeenCalled();
  });

  test('should handle empty results from APIs', async () => {
    nlpService.parseQuery.mockReturnValue({ destination: 'Unknown' });
    flightApi.getFlights.mockReturnValue([]);
    hotelApi.getHotels.mockReturnValue([]);

    const response = await request(app)
      .post('/api/search')
      .send({ query: 'flights to Unknown' });

    expect(response.statusCode).toBe(200);
    expect(response.body.flights).toEqual([]);
    expect(response.body.hotels).toEqual([]);
    expect(nlpService.parseQuery).toHaveBeenCalledWith('flights to Unknown');
    expect(flightApi.getFlights).toHaveBeenCalledWith('Unknown');
    expect(hotelApi.getHotels).toHaveBeenCalledWith('Unknown');
  });
});