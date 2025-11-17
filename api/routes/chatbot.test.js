import { jest } from '@jest/globals';
import request from 'supertest';
import {
  getQuickRepliesForContext,
  getButtonsForContext,
} from './chatbot.js';
import {
  resetSessionStore,
  setSessionStoreMode,
} from '../utils/chatbotSessionStore.js';

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

    process.env.NODE_ENV = 'test';
    setSessionStoreMode('memory');
    // Now that the mock is in place, we can import the app
    const server = await import('../../server.js');
    app = server.app;
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    await resetSessionStore();
  });

  afterAll(async () => {
    const { server } = await import('../../server.js');
    if (server) {
      server.close();
    }
  });

  it('should return a successful response with interactive metadata', async () => {
    const message = 'Hello, chatbot!';
    const mockReply = { reply: 'Hello, user!' };
    travelAgentMock.execute.mockResolvedValue(mockReply);

    const response = await request(app)
      .post('/api/chatbot')
      .send({ message });

    expect(response.status).toBe(200);
    expect(response.body.sessionId).toBeTruthy();
    expect(response.body.reply).toBe(mockReply.reply);
    expect(response.body.text).toBe(mockReply.reply);
    expect(response.body.quickReplies).toEqual(getQuickRepliesForContext('general'));
    expect(response.body.buttons).toEqual(getButtonsForContext('general'));
    expect(travelAgentMock.execute).toHaveBeenCalledWith({ message, history: [] });
  });

  it('should tailor interactive metadata for flight queries', async () => {
    const message = 'I need a flight from NYC to LAX';
    travelAgentMock.execute.mockResolvedValue({ reply: 'Sure, let me gather those flight details.' });

    const response = await request(app)
      .post('/api/chatbot')
      .send({ message });

    expect(response.status).toBe(200);
    expect(response.body.quickReplies).toEqual(getQuickRepliesForContext('flight'));
    expect(response.body.buttons).toEqual(getButtonsForContext('flight'));
  });

  it('should tailor interactive metadata for hotel queries', async () => {
    const message = 'Looking for a hotel in Paris';
    travelAgentMock.execute.mockResolvedValue({ reply: 'Happy to help with hotels in Paris.' });

    const response = await request(app)
      .post('/api/chatbot')
      .send({ message });

    expect(response.status).toBe(200);
    expect(response.body.quickReplies).toEqual(getQuickRepliesForContext('hotel'));
    expect(response.body.buttons).toEqual(getButtonsForContext('hotel'));
  });

  it('should persist conversation history for the same session', async () => {
    const firstMessage = 'Hello there!';
    const secondMessage = 'Can you help me now?';

    travelAgentMock.execute
      .mockResolvedValueOnce({ reply: 'Hi! How can I help?' })
      .mockResolvedValueOnce({ reply: 'Absolutely, what do you need?' });

    const firstResponse = await request(app)
      .post('/api/chatbot')
      .send({ message: firstMessage });

    const sessionId = firstResponse.body.sessionId;

    expect(sessionId).toBeTruthy();
    expect(travelAgentMock.execute).toHaveBeenNthCalledWith(1, {
      message: firstMessage,
      history: [],
    });

    await request(app)
      .post('/api/chatbot')
      .send({ message: secondMessage, sessionId });

    expect(travelAgentMock.execute).toHaveBeenNthCalledWith(2, {
      message: secondMessage,
      history: [
        { role: 'user', text: firstMessage },
        { role: 'bot', text: 'Hi! How can I help?' },
      ],
    });
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
