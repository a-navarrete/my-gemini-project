import { readDb, writeDb } from '../db.js';

/**
 * @typedef {Object} BookingAgent
 * @property {string} role
 * @property {string} goal
 * @property {(bookingDetails: any) => Promise<{success: boolean, message?: string, error?: string}>} execute
 */

function validateBookingPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return 'A booking payload object is required.';
  }

  const { flight, hotel, user, payment } = payload;

  if (!flight || typeof flight !== 'object') {
    return 'Flight details are required.';
  }

  if (!hotel || typeof hotel !== 'object') {
    return 'Hotel details are required.';
  }

  if (!user || typeof user !== 'object') {
    return 'User details are required.';
  }

  if (!payment || typeof payment !== 'object') {
    return 'Payment details are required.';
  }

  return null;
}

/** @type {BookingAgent} */
const bookingAgent = {
  role: 'Booking Specialist',
  goal: 'To persist a validated booking into the database.',
  backstory: 'A meticulous and reliable AI assistant responsible for validating and persisting booking details to the database.',
  execute: async (bookingDetails) => {
    const validationError = validateBookingPayload(bookingDetails);
    if (validationError) {
      return { success: false, error: validationError };
    }

    try {
      const { payment, ...rest } = bookingDetails;
      const { transactionId, ...detailsWithoutTransaction } = rest;

      const bookingRecord = {
        ...detailsWithoutTransaction,
        payment: {
          transactionId: transactionId || payment?.transactionId || null,
        },
      };

      const database = await readDb();
      const bookings = Array.isArray(database.bookings) ? database.bookings : [];
      const updatedBookings = [...bookings, bookingRecord];
      const updatedDatabase = { ...database, bookings: updatedBookings };

      await writeDb(updatedDatabase);

      return { success: true, message: 'Booking successful' };
    } catch (error) {
      console.error('Failed to persist booking', error);
      return { success: false, error: 'Failed to save booking' };
    }
  }
};

export default bookingAgent;
