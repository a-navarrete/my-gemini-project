import request from 'supertest';
import express from 'express';
import bookingRouter from './booking.js';
import { readDb, writeDb } from '../db.js';

// Mock the db service
jest.mock('../db.js', () => ({
  __esModule: true,
  readDb: jest.fn(),
  writeDb: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/api/book', bookingRouter);

describe('POST /api/book', () => {
  beforeEach(() => {
    // Reset mocks before each test
    readDb.mockReset();
    writeDb.mockReset();
  });

  test('should successfully book and save to db', async () => {
    readDb.mockResolvedValue({ bookings: [] });
    writeDb.mockResolvedValue(undefined);

    const bookingDetails = {
      flight: { id: 'F1' },
      hotel: { id: 'H1' },
      user: { name: 'John Doe' },
      payment: { token: 'tok_visa' },
    };

    const response = await request(app)
      .post('/api/book')
      .send(bookingDetails);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Booking successful');
    expect(readDb).toHaveBeenCalledTimes(1);
    expect(writeDb).toHaveBeenCalledTimes(1);
    expect(writeDb).toHaveBeenCalledWith({ bookings: [bookingDetails] });
  });

  test('should return 400 if missing booking information', async () => {
    const bookingDetails = {
      flight: { id: 'F1' },
      hotel: { id: 'H1' },
      user: { name: 'John Doe' },
      // payment is missing
    };

    const response = await request(app)
      .post('/api/book')
      .send(bookingDetails);

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Payment details are required.');
    expect(readDb).not.toHaveBeenCalled();
    expect(writeDb).not.toHaveBeenCalled();
  });

  test('should handle existing bookings in db and preserve other data', async () => {
    const existingBooking = {
      flight: { id: 'F0' },
      hotel: { id: 'H0' },
      user: { name: 'Jane Doe' },
      payment: { token: 'tok_mastercard' },
    };
    readDb.mockResolvedValue({ bookings: [existingBooking], lastUpdated: 'yesterday' });
    writeDb.mockResolvedValue(undefined);

    const newBookingDetails = {
      flight: { id: 'F1' },
      hotel: { id: 'H1' },
      user: { name: 'John Doe' },
      payment: { token: 'tok_visa' },
    };

    const response = await request(app)
      .post('/api/book')
      .send(newBookingDetails);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Booking successful');
    expect(readDb).toHaveBeenCalledTimes(1);
    expect(writeDb).toHaveBeenCalledTimes(1);
    expect(writeDb).toHaveBeenCalledWith({
      bookings: [existingBooking, newBookingDetails],
      lastUpdated: 'yesterday',
    });
  });
});
