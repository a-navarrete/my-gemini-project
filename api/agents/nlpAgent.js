/**
 * @typedef {Object} ParsedDestination
 * @property {string | null} destination - Normalized city/location for services that expect a name.
 * @property {string | null} destinationCode - IATA code suitable for airline lookups.
 */

/**
 * @typedef {Object} NlpAgent
 * @property {string} role - The role of the agent.
 * @property {string} goal - The goal of the agent.
 * @property {(query: string) => ParsedDestination} execute - The function to execute the agent's task.
 */

const DESTINATION_ALIASES = {
  'new york city': { city: 'New York', iataCode: 'NYC' },
  'new york': { city: 'New York', iataCode: 'NYC' },
  nyc: { city: 'New York', iataCode: 'NYC' },
  'los angeles': { city: 'Los Angeles', iataCode: 'LAX' },
  lax: { city: 'Los Angeles', iataCode: 'LAX' },
  'san francisco': { city: 'San Francisco', iataCode: 'SFO' },
  sfo: { city: 'San Francisco', iataCode: 'SFO' },
  london: { city: 'London', iataCode: 'LON' },
  lon: { city: 'London', iataCode: 'LON' },
  lhr: { city: 'London', iataCode: 'LHR' },
  paris: { city: 'Paris', iataCode: 'PAR' },
  par: { city: 'Paris', iataCode: 'PAR' },
  tokyo: { city: 'Tokyo', iataCode: 'TYO' },
  tyo: { city: 'Tokyo', iataCode: 'TYO' },
  madrid: { city: 'Madrid', iataCode: 'MAD' },
  mad: { city: 'Madrid', iataCode: 'MAD' },
  barcelona: { city: 'Barcelona', iataCode: 'BCN' },
  bcn: { city: 'Barcelona', iataCode: 'BCN' },
  rome: { city: 'Rome', iataCode: 'ROM' },
  rom: { city: 'Rome', iataCode: 'ROM' },
  'san diego': { city: 'San Diego', iataCode: 'SAN' },
  san: { city: 'San Diego', iataCode: 'SAN' },
  chicago: { city: 'Chicago', iataCode: 'CHI' },
  chi: { city: 'Chicago', iataCode: 'CHI' },
  miami: { city: 'Miami', iataCode: 'MIA' },
  mia: { city: 'Miami', iataCode: 'MIA' },
  boston: { city: 'Boston', iataCode: 'BOS' },
  bos: { city: 'Boston', iataCode: 'BOS' },
};

const SORTED_ALIAS_KEYS = Object.keys(DESTINATION_ALIASES).sort(
  (a, b) => b.length - a.length
);

const IATA_CODE_REGEX = /\b([A-Z]{3})\b/;
const STOP_WORD_REGEX = /\b(for|with|on|in|by|during|next|this|today|tomorrow|from)\b/i;

/** @type {NlpAgent} */
const nlpAgent = {
  role: 'Natural Language Query Analyst',
  goal: "Extract structured travel parameters from a user's query.",
  backstory: 'An AI assistant specialized in understanding and processing human language for travel planning.',
  execute: (query = '') => {
    if (typeof query !== 'string') {
      return { destination: null, destinationCode: null };
    }

    const explicitCodeMatch = query.match(IATA_CODE_REGEX);
    if (explicitCodeMatch) {
      const candidate = explicitCodeMatch[1].toUpperCase();
      const alias = DESTINATION_ALIASES[candidate.toLowerCase()];
      return {
        destination: alias?.city || null,
        destinationCode: alias?.iataCode || candidate,
      };
    }

    const destinationMatch = query.match(/to\s+([\p{L}\s]+)/iu);
    const rawDestination = destinationMatch ? destinationMatch[1].trim() : '';
    if (!rawDestination) {
      return { destination: null, destinationCode: null };
    }

    const truncatedDestination = rawDestination
      .split(/[,.!?]/)[0]
      .split(STOP_WORD_REGEX)[0]
      .trim();

    const normalizedDestination = truncatedDestination.toLowerCase();
    const matchedAlias = SORTED_ALIAS_KEYS.find((key) =>
      normalizedDestination.startsWith(key)
    );

    if (matchedAlias) {
      const alias = DESTINATION_ALIASES[matchedAlias];
      return { destination: alias.city, destinationCode: alias.iataCode };
    }

    return {
      destination: truncatedDestination || null,
      destinationCode: null,
    };
  },
};

export default nlpAgent;
