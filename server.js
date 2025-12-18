import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bookingRouter from './api/routes/booking.js';
import crewaiRouter from './api/routes/crewai.js';
import chatbotRouter from './api/routes/chatbot.js';
import logger from './config/logger.js';
import flightAgent from './api/agents/flightAgent.js';

console.log('Starting server.js...');

dotenv.config();
console.log('dotenv configured');

const app = express();
console.log('express app created');

const port = process.env.PORT || 3002;
console.log(`Port set to ${port}`);

const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
console.log(`Allowed origins set to: ${allowedOrigins}`);

const bodySizeLimit = process.env.HTTP_BODY_LIMIT || '100kb';
console.log(`Body size limit set to: ${bodySizeLimit}`);

console.log('Configuring CORS...');
app.use(
  cors({
    origin: (origin, callback) => {
      console.log('CORS Origin:', origin);
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
console.log('CORS configured');

console.log('Configuring express.json...');
app.use(express.json({ limit: bodySizeLimit }));
console.log('express.json configured');

app.get('/', (req, res) => {
  res.send('Hello from the AI Travel Assistant API!');
});

app.get('/test-amadeus', async (req, res) => {
  logger.info('Received request for /test-amadeus');
  const flights = await flightAgent.execute('LHR');
  res.json(flights);
});

console.log('Registering booking router...');
app.use('/api/book', bookingRouter);
console.log('Booking router registered');

console.log('Registering crewai router...');
app.use('/api/crewai', crewaiRouter);
console.log('Crewai router registered');

console.log('Registering chatbot router...');
app.use('/api/chatbot', chatbotRouter);
console.log('Chatbot router registered');

console.log('Configuring error handling middleware...');
// Basic error handling middleware
app.use((err, req, res, _next) => {
  if (err.message === 'Not allowed by CORS') {
    logger.warn(`Blocked CORS request from origin: ${req.headers.origin || 'unknown'}`);
    return res.status(403).json({ error: 'Origin not allowed' });
  }
  logger.error(err.message, { stack: err.stack });
  res.status(500).send('Something broke!');
});
console.log('Error handling middleware configured');

let server;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${port}`);
    logger.info(`Server is running on http://localhost:${port}`);
    console.log('Server started and listening!');
  });
}

export { app, server };
export default app;
