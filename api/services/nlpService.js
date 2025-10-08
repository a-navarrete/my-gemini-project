function parseQuery(query) {
  const destinationMatch = query.match(/to (\w+)/);
  const destination = destinationMatch ? destinationMatch[1] : null;
  return { destination };
}

module.exports = { parseQuery };
