/**
 * @typedef {Object} NlpAgent
 * @property {string} role - The role of the agent.
 * @property {string} goal - The goal of the agent.
 * @property {(query: string) => { destination: string | null }} execute - The function to execute the agent's task.
 */

/** @type {NlpAgent} */
const nlpAgent = {
  role: 'Natural Language Query Analyst',
  goal: 'Extract structured travel parameters from a user\'s query.',
  execute: (query = '') => {
    if (typeof query !== 'string') {
      return { destination: null };
    }

    const destinationMatch = query.match(/to\s+([\p{L}\s]+)/u);
    const destination = destinationMatch ? destinationMatch[1].trim() : null;

    return { destination: destination || null };
  }
};

export default nlpAgent;
