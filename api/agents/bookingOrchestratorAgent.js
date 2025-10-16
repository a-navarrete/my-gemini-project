import nlpAgent from './nlpAgent.js';
import flightAgent from './flightAgent.js';
import hotelAgent from './hotelAgent.js';
import bookingAgent from './bookingAgent.js';
import paymentAgent from './paymentAgent.js';

const bookingOrchestratorAgent = {
  role: 'Booking Orchestrator',
  goal: 'Manage the entire booking process from query to confirmation.',
  backstory: 'A master coordinator for travel planning, ensuring a seamless booking process from start to finish by managing all the specialized agents.',

  search: async (query) => {
    const { destination, destinationCode } = nlpAgent.execute(query);
    if (!destination || !destinationCode) {
      return { success: false, message: 'Could not determine a supported destination from query.' };
    }

    const flights = await flightAgent.execute(destinationCode);
    const hotels = await hotelAgent.execute(destination);

    return { success: true, destination, destinationCode, flights, hotels };
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
