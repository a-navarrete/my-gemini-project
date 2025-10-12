import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Manually parse .env file
const envPath = path.resolve(__dirname, '.env');
console.log('Resolved .env path:', envPath);
console.log('.env file exists:', fs.existsSync(envPath));
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, value] = trimmedLine.split('=');
      if (key && value) {
        process.env[key.trim()] = value.trim();
      }
    }
  });
}

import flightAgent from './api/agents/flightAgent.js';

async function testFlightAgent() {
  console.log('Testing flightAgent...');
  console.log('AMADEUS_API_KEY (manual):', process.env.AMADEUS_API_KEY);
  console.log('AMADEUS_API_SECRET (manual):', process.env.AMADEUS_API_SECRET);
  const flights = await flightAgent.execute('LHR');
  console.log('Result:', flights);
}

testFlightAgent();