## Relevant Files

-   `web/src/components/Chatbot.js` - The main React component for the chatbot interface.
-   `web/src/components/Chatbot.test.js` - Unit tests for the Chatbot component.
-   `api/routes/chatbot.js` - The new API route for handling chatbot requests.
-   `api/routes/chatbot.test.js` - Jest test file for the chatbot API endpoint.
-   `api/agents/travelAgent.js` - A new agent responsible for orchestrating the chatbot's logic.
-   `api/crewai_agents/chatbot_crew.py` - The Python script defining the CrewAI agents and tasks for the chatbot.

### Notes

-   Unit tests should be created for all new components and backend logic.
-   The chatbot will leverage the existing CrewAI infrastructure.

## Tasks

-   [ ] 1.0 Setup Chatbot Backend
    -   [x] 1.1 Create a new API endpoint `/api/chatbot` to handle chat messages.
    -   [x] 1.2 Develop a new agent `travelAgent.js` to process requests from the chatbot endpoint.
    -   [x] 1.3 Create a new CrewAI crew in `api/crewai_agents/chatbot_crew.py` for handling natural language requests.
    -   [x] 1.4 Define the tools for the CrewAI agents to use (e.g., flight search, hotel search).
    -   [x] 1.5 Write a test for the `/api/chatbot` endpoint.
-   [ ] 2.0 Implement Flight Search Functionality
    -   [x] 2.1 Create a tool for the CrewAI agent to search for flights, using the existing flight search logic.
    -   [x] 2.2 Implement the logic for the chatbot to ask clarifying questions for flight searches (e.g., dates, destination, origin).
    -   [x] 2.3 Format the flight search results into a user-friendly response for the chatbot.
    -   [x] 2.4 Add a mechanism to select a flight from the results.
    -   [x] 2.5 Write tests for the flight search tool.
-   [x] 3.0 Implement Hotel Search Functionality
    -   [x] 3.1 Create a tool for the CrewAI agent to search for hotels.
    -   [x] 3.2 Implement the logic for the chatbot to ask for hotel search details (e.g., city, dates, number of guests).
    -   [x] 3.3 Format hotel search results for the chatbot.
    -   [x] 3.4 Add a mechanism to select a hotel from the results.
    -   [x] 3.5 Write tests for the hotel search tool.
-   [x] 4.0 Develop Chatbot Frontend
    -   [x] 4.1 Create a new React component `Chatbot.js` for the chat interface.
    -   [x] 4.2 Implement the UI for displaying chat messages (.user and bot).
    -   [x] 4.3 Create the text input for the user to type messages.
    -   [x] 4.4 Add support for interactive elements like buttons and quick replies in the chat interface.
    -   [x] 4.5 Write tests for the `Chatbot.js` component.
-   [x] 5.0 Integrate Frontend and Backend
    -   [x] 5.1 Connect the `Chatbot.js` component to the `/api/chatbot` endpoint.
    -   [x] 5.2 Implement real-time message updates in the UI as the conversation progresses.
    -   [x] 5.3 Ensure the frontend can render the interactive elements sent from the backend.2