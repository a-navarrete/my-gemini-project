/**
 * Extracts travel intent details from a natural-language query.
 * @param {string} query
 * @returns {{ destination: string | null }}
 */
export function parseQuery(query = '') {
  if (typeof query !== 'string') {
    return { destination: null };
  }

  const destinationMatch = query.match(/to\s+([\p{L}\s]+)/u);
  const destination = destinationMatch ? destinationMatch[1].trim() : null;

  return { destination: destination || null };
}

export default { parseQuery };
