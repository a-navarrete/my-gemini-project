import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import searchRouter from './api/routes/search.js';
import bookingRouter from './api/routes/booking.js';
import logger from './config/logger.js';
import flightAgent from './api/agents/flightAgent.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;
const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const bodySizeLimit = process.env.HTTP_BODY_LIMIT || '100kb';

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
app.use(express.json({ limit: bodySizeLimit }));

app.get('/', (req, res) => {
  res.send('Hello from the AI Travel Assistant API!');
});

app.get('/test-amadeus', async (req, res) => {
  logger.info('Received request for /test-amadeus');
  const flights = await flightAgent.execute('LHR');
  res.json(flights);
});

console.log('Registering search router...');
app.use('/api/search', searchRouter);
app.use('/api/book', bookingRouter);

// Basic error handling middleware
app.use((err, req, res, _next) => {
  if (err.message === 'Not allowed by CORS') {
    logger.warn(`Blocked CORS request from origin: ${req.headers.origin || 'unknown'}`);
    return res.status(403).json({ error: 'Origin not allowed' });
  }
  logger.error(err.message, { stack: err.stack });
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
  console.log('Server started and listening!');
});
