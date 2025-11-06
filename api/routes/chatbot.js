import express from 'express';
import travelAgent from '../agents/travelAgent.js';
const router = express.Router();

// @route   POST api/chatbot
// @desc    Chatbot endpoint
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await travelAgent.execute(message);
    res.json(response);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
