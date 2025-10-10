import express from 'express';
import cors from 'cors';
import searchRouter from './api/routes/search.js';
import bookingRouter from './api/routes/booking.js';
import logger from './config/logger.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from the AI Travel Assistant API!');
});

app.use('/api/search', searchRouter);
app.use('/api/book', bookingRouter);

// Basic error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});
