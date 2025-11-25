import express from 'express';
import { randomUUID } from 'crypto';
import travelAgent from '../agents/travelAgent.js';
import {
  getSessionHistory,
  updateSessionHistory,
  resetSessionStore,
} from '../utils/chatbotSessionStore.js';

const router = express.Router();
let activeTravelAgent = travelAgent;

export const setTravelAgentImplementation = (implementation) => {
  activeTravelAgent = implementation || travelAgent;
};

export const getTravelAgentImplementation = () => activeTravelAgent;

const GENERAL_QUICK_REPLIES = [
  { title: 'Search for flights', value: 'search_flights' },
  { title: 'Search for hotels', value: 'search_hotels' },
  { title: 'Plan an entire trip', value: 'plan_trip' },
];

const FLIGHT_QUICK_REPLIES = [
  { title: 'Add departure city', value: 'flight_departure_city' },
  { title: 'Add destination city', value: 'flight_destination_city' },
  { title: 'Add travel dates', value: 'flight_travel_dates' },
];

const HOTEL_QUICK_REPLIES = [
  { title: 'Set hotel city', value: 'hotel_city' },
  { title: 'Set check-in/check-out', value: 'hotel_dates' },
  { title: 'Number of guests', value: 'hotel_guests' },
];

const GENERAL_BUTTONS = [
  { title: 'Popular destinations', value: 'show_popular_destinations' },
  { title: 'Talk to an agent', value: 'contact_human_agent' },
];

const FLIGHT_BUTTONS = [
  { title: 'View best fares', value: 'show_best_fares' },
  { title: 'Track price drops', value: 'track_flight_prices' },
];

const HOTEL_BUTTONS = [
  { title: 'View top hotels', value: 'show_top_hotels' },
  { title: 'Show loyalty deals', value: 'show_loyalty_deals' },
];

const CONTEXT_KEYWORDS = {
  flight: ['flight', 'flights', 'plane', 'airline', 'fare'],
  hotel: ['hotel', 'hotels', 'room', 'rooms', 'stay', 'accommodation'],
};

export { resetSessionStore };

export const detectInteractionContext = (text = '') => {
  const normalized = text.toLowerCase();
  if (CONTEXT_KEYWORDS.flight.some((keyword) => normalized.includes(keyword))) {
    return 'flight';
  }
  if (CONTEXT_KEYWORDS.hotel.some((keyword) => normalized.includes(keyword))) {
    return 'hotel';
  }
  return 'general';
};

export const getQuickRepliesForContext = (context) => {
  switch (context) {
    case 'flight':
      return FLIGHT_QUICK_REPLIES;
    case 'hotel':
      return HOTEL_QUICK_REPLIES;
    default:
      return GENERAL_QUICK_REPLIES;
  }
};

export const getButtonsForContext = (context) => {
  switch (context) {
    case 'flight':
      return FLIGHT_BUTTONS;
    case 'hotel':
      return HOTEL_BUTTONS;
    default:
      return GENERAL_BUTTONS;
  }
};

const extractTextFromAgentResponse = (agentResponse) => {
  if (!agentResponse) {
    return '';
  }

  if (typeof agentResponse === 'string') {
    return agentResponse;
  }

  if (typeof agentResponse === 'object') {
    return agentResponse.reply || agentResponse.text || agentResponse.message || '';
  }

  return String(agentResponse);
};

export const formatChatbotResponse = (agentResponse, userMessage = '') => {
  const agentText = extractTextFromAgentResponse(agentResponse);
  const context = detectInteractionContext(`${userMessage} ${agentText}`.trim());
  const quickReplies = getQuickRepliesForContext(context);
  const buttons = getButtonsForContext(context);
  const basePayload =
    agentResponse && typeof agentResponse === 'object' ? agentResponse : {};

  const replyText = agentText || 'How else can I assist with your travel plans?';

  return {
    ...basePayload,
    reply: replyText,
    text: replyText,
    quickReplies,
    buttons,
  };
};

// @route   POST api/chatbot
// @desc    Chatbot endpoint
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { message, sessionId: incomingSessionId } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const sessionId = incomingSessionId || randomUUID();
    const history = await getSessionHistory(sessionId);

    const response = await activeTravelAgent.execute({ message, history });
    const formattedResponse = formatChatbotResponse(response, message);

    await updateSessionHistory(sessionId, message, formattedResponse.reply || formattedResponse.text);

    res.json({ sessionId, ...formattedResponse });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
