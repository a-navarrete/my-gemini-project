import { jest } from '@jest/globals';

describe('bookingOrchestratorAgent', () => {
  let nlpAgent, flightAgent, hotelAgent, bookingAgent, paymentAgent, bookingOrchestratorAgent;

  beforeAll(async () => {
    const nlpAgentMock = await jest.unstable_mockModule('./nlpAgent.js', () => ({
      default: { execute: jest.fn() }
    }));
    const flightAgentMock = await jest.unstable_mockModule('./flightAgent.js', () => ({
      default: { execute: jest.fn() }
    }));
    const hotelAgentMock = await jest.unstable_mockModule('./hotelAgent.js', () => ({
      default: { execute: jest.fn() }
    }));
    const bookingAgentMock = await jest.unstable_mockModule('./bookingAgent.js', () => ({
      default: { execute: jest.fn() }
    }));
    const paymentAgentMock = await jest.unstable_mockModule('./paymentAgent.js', () => ({
      default: { execute: jest.fn() }
    }));

    nlpAgent = (await import('./nlpAgent.js')).default;
    flightAgent = (await import('./flightAgent.js')).default;
    hotelAgent = (await import('./hotelAgent.js')).default;
    bookingAgent = (await import('./bookingAgent.js')).default;
    paymentAgent = (await import('./paymentAgent.js')).default;
    bookingOrchestratorAgent = (await import('./bookingOrchestratorAgent.js')).default;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('search', () => {
    it('should return flights and hotels for a valid query', async () => {
      nlpAgent.execute.mockReturnValue({ destination: 'london' });
      flightAgent.execute.mockReturnValue([{ id: 1, airline: 'TestAir' }]);
      hotelAgent.execute.mockReturnValue([{ id: 1, name: 'TestHotel' }]);

      const result = await bookingOrchestratorAgent.search('flights to london');
      expect(result.success).toBe(true);
      expect(result.flights).toHaveLength(1);
      expect(result.hotels).toHaveLength(1);
    });

    it('should return an error for an invalid query', async () => {
      nlpAgent.execute.mockReturnValue({ destination: null });

      const result = await bookingOrchestratorAgent.search('invalid query');
      expect(result.success).toBe(false);
      expect(result.message).toBe('Could not determine destination from query.');
    });
  });

  describe('book', () => {
    const bookingDetails = {
      flight: { id: 1 },
      hotel: { id: 1 },
      user: { name: 'Test User' },
      payment: { token: 'test_token' }
    };

    it('should successfully book a valid payload', async () => {
      paymentAgent.execute.mockResolvedValue({ success: true, transactionId: 'txn_123' });
      bookingAgent.execute.mockResolvedValue({ success: true, message: 'Booking successful' });

      const result = await bookingOrchestratorAgent.book(bookingDetails);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Booking successful');
    });

    it('should handle payment failure', async () => {
      paymentAgent.execute.mockResolvedValue({ success: false, error: 'Payment failed' });

      const result = await bookingOrchestratorAgent.book(bookingDetails);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Payment failed');
    });

    it('should handle booking failure (fallback test)', async () => {
      paymentAgent.execute.mockResolvedValue({ success: true, transactionId: 'txn_123' });
      bookingAgent.execute.mockResolvedValue({ success: false, error: 'Failed to save booking' });

      const result = await bookingOrchestratorAgent.book(bookingDetails);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to save booking');
    });
  });
});
