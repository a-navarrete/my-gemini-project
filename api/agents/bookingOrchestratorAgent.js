import nlpAgent from './nlpAgent.js';
import flightAgent from './flightAgent.js';
import hotelAgent from './hotelAgent.js';
import bookingAgent from './bookingAgent.js';
import paymentAgent from './paymentAgent.js';

const bookingOrchestratorAgent = {
  role: 'Booking Orchestrator',
  goal: 'Manage the entire booking process from query to confirmation.',

  search: async (query) => {
    const { destination } = nlpAgent.execute(query);
    if (!destination) {
      return { success: false, message: 'Could not determine destination from query.' };
    }

    const flights = flightAgent.execute(destination);
    const hotels = hotelAgent.execute(destination);

    return { success: true, flights, hotels };
  },

  book: async (bookingDetails) => {
    // In a real scenario, we might have a separate validation agent.
    // For now, the booking agent does validation.

    // 1. Process payment
    const paymentResult = await paymentAgent.execute(bookingDetails.payment);
    if (!paymentResult.success) {
      return { success: false, error: 'Payment failed' };
    }

    // 2. Persist booking
    const { payment: _payment, ...rest } = bookingDetails;
    const bookingResult = await bookingAgent.execute({
      ...rest,
      transactionId: paymentResult.transactionId,
      payment: { transactionId: paymentResult.transactionId },
    });

    return bookingResult;
  }
};

export default bookingOrchestratorAgent;
