
## Relevant Files

- `server.js` - Created: Main entry point for the Express.js backend API.
- `package.json` - Modified: Added backend dependencies like `express`, `cors`, `dotenv` and dev dependencies like `jest`, `supertest`.
- `api/routes/search.js` - New: API route handler for flight and hotel searches.
- `api/routes/booking.js` - New: API route handler for the unified booking process.
- `api/agents/nlpAgent.js` - New: Agent for parsing natural language queries.
- `api/agents/flightAgent.js` - New: Agent for finding flights.
- `api/agents/hotelAgent.js` - New: Agent for finding hotels.
- `web/src/App.js` - To be modified: Integrate the new search and results components.
- `web/src/components/AiSearchBar.js` - New: The main search bar component for user input.
- `web/src/components/AiSearchBar.test.js` - New: Unit tests for `AiSearchBar.js`.
- `web/src/components/ResultsView.js` - New: Component to display flight and hotel results.
- `web/src/components/ResultsView.test.js` - New: Unit tests for `ResultsView.js`.
- `web/src/components/Checkout.js` - New: Component for the unified checkout page.
- `web/src/components/Checkout.test.js` - New: Unit tests for `Checkout.js`.

### Notes

- Unit tests should be placed alongside the code files they are testing.
- The frontend (`web` directory) is already configured to use Jest. Run `npm test` to execute frontend tests.
- For the backend, Jest and Supertest will be used for API integration tests.

## Tasks

- [x] 0.0 **Setup: Project Setup**
  - [x] 0.1 Create and switch to a new git branch: `git checkout -b feature/ai-travel-assistant`.

- [x] 1.0 **Backend: Create an Express.js API**
  - [x] 1.1 Install backend dependencies: `npm install express cors dotenv`.
  - [x] 1.2 Install backend development dependencies for testing: `npm install --save-dev jest supertest`.
  - [x] 1.3 Create a `server.js` file in the root directory to set up the Express app.
  - [x] 1.4 Create a new `/api/search` endpoint that accepts a POST request with a search query.
  - [x] 1.5 Configure CORS to allow requests from the React frontend.
  - [x] 1.6 Add basic error handling middleware to the Express app.
  - [x] 1.7 **Test:** Manually test the `/api/search` endpoint using a tool like `curl` to ensure it returns a mock response.

- [x] 2.0 **Frontend: Implement AI-Powered Search Component**
  - [x] 2.1 Create a new component file: `web/src/components/AiSearchBar.js`.
  - [x] 2.2 In this component, create a form with a text input for the natural language query.
  - [x] 2.3 On form submission, make a POST request to the `/api/search` endpoint with the query.
  - [x] 2.4 Use state to manage loading and error states during the API call.
  - [x] 2.5 Integrate the `AiSearchBar` into `web/src/App.js`, replacing the current navigation buttons.
  - [x] 2.6 **Test:** Write a unit test for the `AiSearchBar` component and verify in the browser that it can send a query and receive a mock response from the backend.

- [x] 3.0 **Frontend: Develop a Flexible Results Interface**
  - [x] 3.1 Create a new component `web/src/components/ResultsView.js` to hold the results.
  - [x] 3.2 This component should receive the flight and hotel data as props from `App.js`.
  - [x] 3.3 Create a `FlightResults.js` component to display a list of flights.
  - [x] 3.4 Create a `HotelResults.js` component to display a list of hotels.
  - [x] 3.5 Add "Select" buttons to each flight and hotel item.
  - [x] 3.6 Create a `TripSummary.js` component that shows the selected flight and hotel.
  - [x] 3.7 **Test:** Write unit tests for the new components and verify in the browser that selecting a flight and hotel updates the trip summary.

- [x] 4.0 **Backend: Integrate with Third-Party APIs (Amadeus for Flights, Hotelbeds for Hotels)**
  - [x] 4.1 In the `/api/search` endpoint, add logic to call external flight and hotel APIs.
  - [x] 4.2 Create a mock NLP service in `api/services/nlpService.js` that can parse simple queries (e.g., "flights to london") into structured data (`{destination: 'london'}`).
  - [x] 4.3 Use the structured data to query the external APIs.
  - [x] 4.4 Normalize the responses from the different APIs into a consistent format before sending them to the frontend.
  - [x] 4.5 **Test:** Manually test the `/api/search` endpoint again to ensure it correctly fetches and returns data from the live external APIs.

- [x] 5.0 **Frontend: Build the Unified Checkout Flow**
  - [x] 5.1 Create a `Checkout.js` component.
  - [x] 5.2 The `TripSummary` component should have a "Book Now" button that navigates to the checkout page.
  - [x] 5.3 The `Checkout.js` component should display the final trip details and a form for user/payment information.
  - [x] 5.4 On form submission, send the booking details to a new `/api/book` endpoint.
  - [x] 5.5 **Test:** Write unit tests for the `Checkout` component and verify the browser flow from the summary to the checkout page.
3
- [x] 6.0 **Backend: Implement the Booking Endpoint**
  - [x] 6.1 Create a new `/api/book` endpoint that accepts a POST request.
  - [x] 6.2 The endpoint should receive flight details, hotel details, user information, and a payment token.
  - [x] 6.3 Integrate with a payment gateway like Stripe (in test mode).
  - [x] 6.4 Call the payment gateway to process the payment.
  - [x] 6.5 If payment succeeds, return a success message. Handle any potential errors from the payment gateway.
  - [x] 6.6 **Test:** Manually test the `/api/book` endpoint with a mock payment token to ensure it works as expected.

- [x] 7.0 **Database and Persistence**
  - [x] 7.1 Choose and set up a database (e.g., PostgreSQL, MongoDB).
  - [x] 7.2 Design a database schema for storing booking information.
  - [x] 7.3 Implement logic in the backend to save booking details to the database after a successful payment.
  - [x] 7.4 **Test:** Write an integration test using **Jest** to verify that a successful booking is correctly saved to the database.

- [x] 8.0 **Comprehensive Testing**
  - [x] 8.1 Write integration tests for the API endpoints (`/api/search`, `/api/book`) using **Jest** and **Supertest**.
  - [x] 8.2 Set up an end-to-end testing framework (e.g., Cypress, Playwright).
  - [x] 8.3 Write E2E tests for the main user flow: searching, selecting a flight/hotel, and completing the booking form.

- [ ] 9.0 **Deployment**
  - [x] 9.1 Prepare the backend API for production (e.g., environment variables, logging).
  - [x] 9.2 Choose a hosting provider and deploy the backend service (e.g., Heroku, AWS, Vercel).
  - [x] 9.3 Prepare the frontend React app for production using `npm run build`.
  - [x] 9.4 Deploy the frontend application (e.g., Netlify, Vercel, S3).
  - [x] 9.5 **Test:** Perform a smoke test on the live application to verify all core functionality is working.

- [x] 10.0 **Agent Automation/Orchestration**
  - [x] 10.1 Refactor service modules (flightApi, hotelApi, nlpService) to conform to CrewAI-style agent abstraction, allowing modular tasks and scalable orchestration.
  - [x] 10.2 Implement a “booking orchestrator agent” to chain together NLP parsing, multiple API calls (Amadeus, Hotelbeds), normalization, booking, and payment as discrete steps that can be retried or escalated.
  - [x] 10.3 Add tests for agent chaining and fallback—verify correct routing of errors, and that “human handoff” (to support) is possible.
  - [x] 10.4 Document the architecture so new agents (for car rental, activities, price alerts) can be easily added later.