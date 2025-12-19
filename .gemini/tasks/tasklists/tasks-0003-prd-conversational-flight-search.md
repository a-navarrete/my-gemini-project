# Task List: Conversational Flight Search

## Relevant Files

-   `web/src/components/Chatbot.js` - Modified: To be refactored with Tailwind CSS and integrated with the new `FlightResultCard` component.
-   `web/src/components/Chatbot.test.js` - Modified: Update tests to reflect the UI changes and new functionality.
-   `web/src/components/Chatbot.css` - Deleted: All styles will be migrated to Tailwind CSS utility classes.
-   `web/src/components/FlightResultCard.js` - New: A component to display a single flight option within the chat, designed to show fare and baggage details clearly.
-   `web/src/components/FlightResultCard.test.js` - New: Unit tests for the `FlightResultCard` component.
-   `web/src/components/QuickReply.js` - Modified: To be refactored with Tailwind CSS.
-   `web/src/components/InteractiveButtons.js` - Modified: To be refactored with Tailwind CSS.
-   `api/routes/chatbot.js` - Modified: Enhance the endpoint to handle multi-turn conversations and return structured flight data.
-   `api/routes/chatbot.test.js` - Modified: Add integration tests for the new conversational flight search logic.
-   `.gemini/design-inspo.md` - Reference: Source of truth for visual and UX design principles.
-   `.gemini/ui-library.md` - Reference: Contains the approved Tailwind CSS patterns to be used.

### Notes

-   The primary goal of the frontend refactoring is to eliminate the dependency on `Chatbot.css` and adopt the project's design system via Tailwind CSS.
-   Backend logic must be enhanced to maintain conversation state, allowing users to refine searches.

## Tasks

- [x] 1.0 **Design: Define the Conversational UI/UX**
  - [x] 1.1 **(Design Architect)** Create high-fidelity mockups for the main chat interface, adhering to the "Modern Professional" aesthetic in `design-inspo.md`.
  - [x] 1.2 **(Design Architect)** Design the `FlightResultCard` component, ensuring it clearly displays fare tiers (e.g., Basic, Main), baggage info, and follows the layout principles from the UI library.
  - [x] 1.3 **(Design Architect)** Define the specific Tailwind CSS classes or styles for all interactive elements, including quick replies and buttons.
  - [x] 1.4 **(Design Architect)** Create mockups for the different chat states: loading (skeleton), empty results, and error messages.

- [x] 2.0 **Backend: Enhance Conversational Flight Search Logic**
  - [x] 2.1 Enhance the `/api/chatbot` endpoint to manage conversation history and context for follow-up questions.
  - [x] 2.2 Improve the NLP agent to extract entities from more complex queries (e.g., "flights from SFO to JFK next Friday for 2 adults and 1 child").
  - [x] 2.3 Add logic to the flight search agent to fetch and include different fare types (e.g., Economy, Business) and their details in the API response.
  - [x] 2.4 Structure the API response to include flight data formatted for consumption by the new `FlightResultCard` component.
  - [x] 2.5 Write integration tests for the `/api/chatbot` endpoint to verify contextual query handling.

- [x] 3.0 **Frontend: Refactor Chatbot UI with Tailwind CSS**
  - [x] 3.1 Remove all classNames and styles from `Chatbot.css` and delete the file.
  - [x] 3.2 Apply Tailwind CSS classes from `.gemini/ui-library.md` to `Chatbot.js` and its child components (`QuickReply.js`, `InteractiveButtons.js`) to match the new design mockups.
  - [x] 3.3 Ensure the refactored chat window is responsive and adheres to the mobile-first principle (verifiable at 375px width).
  - [x] 3.4 Update the `Chatbot.test.js` snapshot and functional tests to reflect the new DOM structure.

- [x] 4.0 **Frontend: Implement Flight Result Cards**
  - [x] 4.1 Create the new `web/src/components/FlightResultCard.js` file.
  - [x] 4.2 Build the component to accept flight data as props and render it according to the Design Architect's specs. It should clearly display price, times, duration, and fare options.
  - [x] 4.3 Create the corresponding `FlightResultCard.test.js` and write unit tests to ensure the component renders correctly with various data inputs.
  - [x] 4.4 In `Chatbot.js`, add logic to detect when a message from the bot contains flight data and render a list of `FlightResultCard` components accordingly.

- [ ] 5.0 **Integration: Connect UI to Backend and Test End-to-End**
  - [ ] 5.1 Perform a test in the live application to ensure a user query like "flights to nyc" flows correctly from the UI to the backend and returns structured flight cards.
  - [ ] 5.2 Test the conversational refinement flow (e.g., initial search, then a follow-up like "only non-stop").
  - [ ] 5.3 Verify that loading, empty, and error states are correctly displayed in the UI based on the backend's response.

- [ ] 6.0 **Visual QA: Audit and Approve the Final Experience**
  - [ ] 6.1 **(Design Architect)** Perform a Playwright audit of the final, integrated chat experience against the design mockups.
  - [ ] 6.2 **(Design Architect)** Capture screenshots at both desktop (1440px) and mobile (375px) widths and verify them against the `design-inspo.md` principles.
  - [ ] 6.3 **(Design Architect)** Run an accessibility check and confirm there are no major issues.
  - [ ] 6.4 Provide a final **PASS** or **NEEDS REVISION** verdict before the feature can be considered complete.
