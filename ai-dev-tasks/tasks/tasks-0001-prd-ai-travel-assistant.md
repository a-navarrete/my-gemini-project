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

- [x] 9.0 **Deployment**
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

- [x] 12.0 **Formalize agent definitions**
  - [x] 12.1 Add explicit `role`, `goal`, and `backstory` properties to `api/agents/nlpAgent.js` to match the other agents.
  - [x] 12.2 Add a `backstory` property to `flightAgent.js`, `hotelAgent.js`, and `bookingOrchestratorAgent.js` for completeness.
  - [x] 12.3 Ensure all agents export a consistent object structure.


## Relevant Files

-   `api/crewai_agents/` - New directory for the Python CrewAI project.
-   `api/crewai_agents/tools.py` - New: Python module to define custom CrewAI tools.
-   `api/crew11ai_agents/agents.py` - New: Python module to define CrewAI agents.
-   `api/crewai_agents/crew.py` - New: Python module to define the CrewAI orchestration workflow.
-   `api/crewai_agents/main.py` - New: Entry point for the Python CrewAI application.
-   `api/agents/nlpAgent.js` - Modified: Will be wrapped by a Python tool or its logic re-implemented.
-   `api/agents/flightAgent.js` - Modified: Will be wrapped by a Python tool or its logic re-implemented.
-   `api/agents/hotelAgent.js` - Modified: Will be wrapped by a Python tool or its logic re-implemented.
-   `api/agents/bookingAgent.js` - Modified: Will be wrapped by a Python tool or its logic re-implemented.
-   `api/agents/paymentAgent.js` - Modified: Will be wrapped by a Python tool or its logic re-implemented.
-   `api/agents/bookingOrchestratorAgent.js` - Modified: Its orchestration logic will be replaced by the CrewAI `Crew`.
-   `server.js` - Modified: Add a new endpoint to proxy requests to the Python CrewAI backend.
-   `web/src/App.js` - Modified: Update to communicate with the new CrewAI backend endpoint.
-   `web/src/components/AiSearchBar.js` - Modified: Update to communicate with the new CrewAI backend endpoint.
-   `requirements.txt` - New: To list Python dependencies for the CrewAI project.
-   `.env` - Modified: Add environment variables for LLM API keys.
-   `package.json` - Modified: Potentially add new scripts for managing the Python backend.
-   `api/crewai_agents/tests/` - New: Directory for Python unit and integration tests for CrewAI components.
-   `web/src/components/AiSearchBar.test.js` - Modified/New: Update tests for new backend integration.
-   `web/src/components/ResultsView.test.js` - Modified/New: Update tests for new backend integration.
-   `web/src/components/Checkout.test.js` - Modified/New: Update tests for new backend integration.

### Notes

-   The existing JavaScript agents will either be wrapped by Python tools or their core logic will be re-implemented in Python.
-   A new Python virtual environment will be used for the CrewAI project to manage dependencies.
-   LLM API keys will need to be securely configured in the `.env` file.

## Tasks

-   [x] 13.0 **Setup CrewAI Development Environment**
    -   [x] 13.1 Install Python (version 3.9+) and `pip` if not already present on the system.
    -   [x] 13.2 Create a new Python virtual environment (e.g., `python -m venv venv_crewai`) in the project root or `api/crewai_agents/`.
    -   [x] 13.3 Activate the virtual environment.
    -   [x] 13.4 Install `crewai` and `crewai_tools` within the virtual environment (`pip install crewai crewai_tools`).
    -   [x] 13.5 Install necessary LLM client libraries (e.g., `pip install openai google-generativeai`).
    -   [x] 13.6 Add `requirements.txt` to the `api/crewai_agents/` directory, listing all Python dependencies.
    -   [x] 13.7 Configure environment variables for LLM API keys (e.g., `OPENAI_API_KEY`, `GEMINI_API_KEY`) in the project's `.env` file.
    -   [x] 13.8 Create a new directory `api/crewai_agents/` to house the Python CrewAI project.

-   [x] 14.0 **Define CrewAI Tools for Existing Functionality**
    -   [x] 14.1 Create `api/crewai_agents/tools.py` to define custom CrewAI tools.
    -   [x] 14.2 Implement a `NLPParsingTool` in `tools.py` that encapsulates the logic from `api/agents/nlpAgent.js` (or calls it via an internal API).
    -   [x] 14.3 Implement a `FlightSearchTool` in `tools.py` that encapsulates the logic from `api/agents/flightAgent.js` (or calls it).
    -   [x] 14.4 Implement a `HotelSearchTool` in `tools.py` that encapsulates the logic from `api/agents/hotelAgent.js` (or calls it).
    -   [x] 14.5 Implement a `BookingPersistenceTool` in `tools.py` that encapsulates the logic from `api/agents/bookingAgent.js` (or calls it).
    -   [x] 14.6 Implement a `PaymentProcessingTool` in `tools.py` that encapsulates the logic from `api/agents/paymentAgent.js` (or calls it).

-   [x] 15.0 **Implement CrewAI Agents**
    -   [x] 15.1 Create `api/crewai_agents/agents.py` to define CrewAI agents.
    -   [x] 15.2 Define a `NLPAgent` (CrewAI `Agent` object) with a clear `role`, `goal`, `backstory`, and assign the `NLPParsingTool`.
    -   [x] 15.3 Define a `FlightSearchAgent` (CrewAI `Agent` object) with `role`, `goal`, `backstory`, and assign the `FlightSearchTool`.
    -   [x] 15.4 Define a `HotelSearchAgent` (CrewAI `Agent` object) with `role`, `goal`, `backstory`, and assign the `HotelSearchTool`.
    -   [x] 15.5 Define a `BookingAgent` (CrewAI `Agent` object) with `role`, `goal`, `backstory`, and assign the `BookingPersistenceTool`.
    -   [x] 15.6 Define a `PaymentAgent` (CrewAI `Agent` object) with `role`, `goal`, `backstory`, and assign the `PaymentProcessingTool`.
    -   [x] 15.7 Configure the LLM for each agent (e.g., `llm=OpenAIChat(model='gpt-4-turbo')` or `llm=ChatGoogleGenerativeAI(model='gemini-pro')`).

-   [x] 16.0 **Build CrewAI Orchestration Workflow**
    -   [x] 16.1 Create `api/crewai_agents/crew.py` to define the CrewAI orchestration.
    -   [x] 16.2 Define `Task` objects for NLP parsing, flight search, hotel search, booking, and payment, specifying `description` and `expected_output`.
    -   [x] 16.3 Assign the appropriate CrewAI agents to each `Task`.
    -   [x] 16.4 Create a `Crew` object, providing the list of agents and tasks, and setting the `process` (e.g., `Process.sequential`).
    -   [x] 16.5 Implement a `kickoff()` method in `crew.py` to initiate the CrewAI workflow, accepting user queries as input.
    -   [x] 16.6 Create `api/crewai_agents/main.py` as the entry point for the Python CrewAI application, which will call the `crew.py`'s `kickoff` method.

-   [ ] 17.0 **Integrate CrewAI Backend with Frontend**
    -   [ ] 17.1 Create a new API endpoint in the existing Node.js `server.js` (e.g., `/api/crewai_orchestrate`) to serve as a proxy to the Python CrewAI backend.
    -   [ ] 17.2 Implement logic in this Node.js endpoint to call the Python CrewAI orchestration (e.g., via HTTP request to a Python Flask/FastAPI server, or by spawning a Python process).
    -   [ ] 17.3 Update `web/src/App.js` to send search and booking requests to the new `/api/crewai_orchestrate` endpoint.
    -   [ ] 17.4 Adapt `web/src/components/AiSearchBar.js` to handle the new request/response format.
    -   [ ] 17.5 Adapt `web/src/components/ResultsView.js` and `web/src/components/Checkout.js` to display data from the new CrewAI backend.

-   [x] 18.0 **Comprehensive Testing of CrewAI System**
    -   [ ] 18.1 Write unit tests for each custom CrewAI Tool in `api/crewai_agents/tests/test_tools.py`.
    -   [ ] 18.2 Write integration tests for the CrewAI agents and their interactions in `api/crewai_agents/tests/test_agents.py`.
    -   [ ] 18.3 Write integration tests for the full CrewAI workflow in `api/crewai_agents/tests/test_crew.py`.
    -   [ ] 18.4 Write integration tests for the Node.js proxy endpoint in `server.test.js`.
    -   [ ] 18.5 Update existing frontend tests or create new ones to reflect the new backend integration.
    -   [ ] 18.6 Set up E2E tests for the complete user journey through the CrewAI system.