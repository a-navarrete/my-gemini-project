import dotenv from 'dotenv';
dotenv.config();

import flightAgent from './api/agents/flightAgent.js';

async function testFlightAgent() {
  console.log('Testing flightAgent...');
  const flights = await flightAgent.execute('LHR');
  console.log('Result:', flights);
}

testFlightAgent();