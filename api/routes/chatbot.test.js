import { jest } from '@jest/globals';
import request from 'supertest';

describe('POST /api/chatbot', () => {
  let app;
  let travelAgentMock;

  beforeAll(async () => {
    travelAgentMock = {
      execute: jest.fn(),
    };
    await jest.unstable_mockModule('../agents/travelAgent.js', () => ({
      default: travelAgentMock,
    }));

    // Now that the mock is in place, we can import the app
    const server = await import('../../server.js');
    app = server.app;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    const { server } = await import('../../server.js');
    if (server) {
      server.close();
    }
  });

  it('should return a successful response from the chatbot', async () => {
    const message = 'Hello, chatbot!';
    const mockReply = { reply: 'Hello, user!' };
    travelAgentMock.execute.mockResolvedValue(mockReply);

    const response = await request(app)
      .post('/api/chatbot')
      .send({ message });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockReply);
    expect(travelAgentMock.execute).toHaveBeenCalledWith(message);
  });

  it('should handle errors from the travel agent', async () => {
    const message = 'This will cause an error';
    travelAgentMock.execute.mockRejectedValue(new Error('Something went wrong'));

    const response = await request(app)
      .post('/api/chatbot')
      .send({ message });

    expect(response.status).toBe(500);
    expect(response.text).toBe('Server Error');
  });
});
