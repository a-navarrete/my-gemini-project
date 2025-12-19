/**
 * @typedef {Object} ParsedLocation
 * @property {string | null} city
 * @property {string | null} code
 */

/**
 * @typedef {Object} ParsedPassengers
 * @property {number} adults
 * @property {number} children
 * @property {number} infants
 */

/**
 * @typedef {Object} ParsedQuery
 * @property {'PACKAGE_TRIP' | 'FLIGHT_SEARCH' | 'HOTEL_SEARCH' | 'UNKNOWN'} intent
 * @property {('flight' | 'hotel')[]} domains
 * @property {ParsedLocation} origin
 * @property {ParsedLocation} destination
 * @property {string | null} date
 * @property {ParsedPassengers} passengers
 */

/**
 * @typedef {Object} NlpAgent
 * @property {string} role
 * @property {string} goal
 * @property {string} backstory
 * @property {(query: string) => ParsedQuery} execute
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
};

const SORTED_ALIAS_KEYS = Object.keys(DESTINATION_ALIASES).sort((a, b) => b.length - a.length);

const cleanLocationString = (text) => {
  const stopWords = /\b(for|with|on|in|by|during|next|this|today|tomorrow)\b/gi;
  return text.split(/[,.!?]/)[0].replace(stopWords, '').trim();
};

const parseLocation = (text) => {
  if (!text) return { city: null, code: null };
  const cleanedText = cleanLocationString(text).toLowerCase();
  const alias = DESTINATION_ALIASES[cleanedText];
  if (alias) return { city: alias.city, code: alias.iataCode };
  const iataMatch = cleanedText.match(/\b([A-Z]{3})\b/);
  if (iataMatch) {
    const code = iataMatch[1].toUpperCase();
    const foundAlias = Object.values(DESTINATION_ALIASES).find(a => a.iataCode === code);
    return { city: foundAlias?.city || null, code };
  }
  const matchedAliasKey = SORTED_ALIAS_KEYS.find((key) => cleanedText.startsWith(key));
  if (matchedAliasKey) {
    const foundAlias = DESTINATION_ALIASES[matchedAliasKey];
    return { city: foundAlias.city, code: foundAlias.iataCode };
  }
  return { city: text, code: null };
};

const extractPassengers = (query) => {
  const passengers = { adults: 0, children: 0, infants: 0 };
  const passengersMatch = query.match(/for\s+((?:\d+\s+\w+)(?:(?:,?\s+and)?\s*\d+\s+\w+)*)/i);
  if (!passengersMatch) return passengers;
  const passengerStr = passengersMatch[1];
  const adultMatch = passengerStr.match(/(\d+)\s+adult/i);
  if (adultMatch) passengers.adults = parseInt(adultMatch[1], 10);
  const childMatch = passengerStr.match(/(\d+)\s+child/i);
  if (childMatch) passengers.children = parseInt(childMatch[1], 10);
  const infantMatch = passengerStr.match(/(\d+)\s+infant/i);
  if (infantMatch) passengers.infants = parseInt(infantMatch[1], 10);
  if (passengers.adults === 0 && passengers.children === 0 && passengers.infants === 0) {
    const numberMatch = passengerStr.match(/(\d+)/);
    if (numberMatch) passengers.adults = parseInt(numberMatch[1], 10);
  }
  return passengers;
};

const extractDate = (query) => {
  const normalizedQuery = query.toLowerCase();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const nextDayMatch = normalizedQuery.match(/next\s+(\w+day)/);
  if (nextDayMatch) {
    const dayName = nextDayMatch[1];
    const dayIndex = days.indexOf(dayName);
    if (dayIndex !== -1) {
      const d = new Date();
      d.setDate(d.getDate() + ((dayIndex + 7 - d.getDay()) % 7) + 7);
      return d.toISOString().split('T')[0];
    }
  }
  if (normalizedQuery.includes('tomorrow')) {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T-')[0];
  }
  if (normalizedQuery.includes('today')) return new Date().toISOString().split('T')[0];
  return null;
};

const detectIntent = (query) => {
  const normalizedQuery = query.toLowerCase();
  const domains = [];
  let intent = 'UNKNOWN';

  const hasFlight = /\b(flight|fly|plane|airfare)\b/.test(normalizedQuery);
  const hasHotel = /\b(hotel|room|stay|accommodation)\b/.test(normalizedQuery);
  const hasTrip = /\b(trip|vacation|package|journey)\b/.test(normalizedQuery);

  if (hasFlight) domains.push('flight');
  if (hasHotel) domains.push('hotel');

  if (hasTrip || (hasFlight && hasHotel)) {
    intent = 'PACKAGE_TRIP';
    if (!domains.includes('flight')) domains.push('flight');
    if (!domains.includes('hotel')) domains.push('hotel');
  } else if (hasFlight) {
    intent = 'FLIGHT_SEARCH';
  } else if (hasHotel) {
    intent = 'HOTEL_SEARCH';
  }

  return { intent, domains };
};

/** @type {NlpAgent} */
const nlpAgent = {
  role: 'Natural Language Query Analyst',
  goal: "Extract structured travel parameters and user intent from a query.",
  backstory: 'An AI assistant specialized in understanding and processing human language for travel planning.',
  execute: (query = '') => {
    if (typeof query !== 'string') {
      return { intent: 'UNKNOWN', domains: [], origin: null, destination: null, date: null, passengers: null };
    }

    const { intent, domains } = detectIntent(query);

    const fromMatch = query.match(/from\s+([\w\s,]+)\b/i);
    const toMatch = query.match(/to\s+([\w\s,]+)\b/i);

    const originText = fromMatch ? fromMatch[1] : '';
    const destinationText = toMatch ? toMatch[1] : '';

    const origin = parseLocation(originText);
    const destination = parseLocation(destinationText);

    const passengers = extractPassengers(query);
    if (passengers.adults === 0) passengers.adults = 1;

    const date = extractDate(query);

    return {
      intent,
      domains,
      origin,
      destination,
      date,
      passengers,
    };
  },
};

export default nlpAgent;
