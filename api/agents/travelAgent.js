import nlpAgent from './nlpAgent.js';
import flightAgent from './flightAgent.js';
import hotelAgent from './hotelAgent.js';
import packagingAgent from './packagingAgent.js';

class TravelAgent {
  normalizePayload(payload) {
    if (typeof payload === 'string') {
      return { message: payload, history: [] };
    }
    return {
      message: payload?.message || '',
      history: Array.isArray(payload?.history) ? payload.history : [],
    };
  }

  async execute(payload) {
    const normalizedPayload = this.normalizePayload(payload);
    const { message } = normalizedPayload;

    // 1. Understand the user's intent
    const nlpResult = nlpAgent.execute(message);
    const { intent, domains, destination } = nlpResult;

    let agentResponse = {
      reply: "I'm sorry, I'm not sure how to help with that. I can search for flights, hotels, or travel packages.",
    };

    // 2. Orchestrate downstream agents based on intent
    if (intent === 'FLIGHT_SEARCH' || intent === 'HOTEL_SEARCH' || intent === 'PACKAGE_TRIP') {
      if (!destination.code && !destination.city) {
        return { reply: "I can help with that, but I'll need a destination. Where are you thinking of going?" };
      }

      const destinationIdentifier = destination.code || destination.city;
      const promises = [];

      if (domains.includes('flight')) {
        promises.push(flightAgent.execute(destinationIdentifier));
      }
      if (domains.includes('hotel')) {
        promises.push(hotelAgent.execute(destinationIdentifier));
      }

      // 3. Gather results from all agents
      const results = await Promise.all(promises);
      const flightResults = domains.includes('flight') ? results[domains.indexOf('flight')] : [];
      const hotelResults = domains.includes('hotel') ? results[domains.indexOf('hotel')] : [];

      // 4. Create packages if necessary
      if (intent === 'PACKAGE_TRIP') {
        const packages = packagingAgent.execute(flightResults, hotelResults);
        agentResponse = {
          ...nlpResult,
          packages,
          reply: packages.length > 0
            ? `I've found ${packages.length} packages for your trip to ${destination.city || destination.code}.`
            : `I couldn't find any packages for that trip. Would you like to search for flights and hotels separately?`,
        };
      } else {
         agentResponse = {
          ...nlpResult,
          flights: flightResults,
          hotels: hotelResults,
          reply: `I've found some options for your trip to ${destination.city || destination.code}.`,
        };
      }
    }
    
    return agentResponse;
  }
}

export default new TravelAgent();
