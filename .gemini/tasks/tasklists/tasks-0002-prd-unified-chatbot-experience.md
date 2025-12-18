## Relevant Files

- `web/src/App.js` - The main application component where the UI structure is defined.
- `web/src/components/Chatbot.js` - The Chatbot component that will be modified to become the primary interface.
- `web/src/components/AiSearchBar.js` - The search bar component that will be removed.
- `web/src/components/AiSearchBar.test.js` - Tests for the search bar component to be removed.
- `web/src/components/AiSearchBar.integration.test.js` - Integration tests for the search bar to be removed.
- `api/routes/search.js` - The API route for the old search functionality, which may be deprecated.
- `.gemini/tasks/prd/0002-prd-unified-chatbot-experience.md` - The PRD for this feature.

### Notes

- Unit tests should be updated to reflect the new user flow.
- The goal is to have a single, conversational entry point for the application.

## Tasks

- [x] 1.0 UI Refactoring: Consolidate the main interface around the chatbot.
  - [x] 1.1 In `web/src/App.js`, remove the rendering of the `AISearchBar` component.
  - [x] 1.2 Adjust the layout in `web/src/App.js` to position the `Chatbot` component as the central UI element.
  - [x] 1.3 Update any associated CSS in `App.css` or `index.css` to ensure the new single-prompt layout is visually correct.
- [x] 2.0 Frontend Logic: Adapt the Chatbot component for the new entry flow.
  - [x] 2.1 Modify `web/src/components/Chatbot.js` to have an initial state that displays the "Where are we traveling to?" prompt.
  - [x] 2.2 Implement the submission logic for the initial prompt.
  - [x] 2.3 On initial submission, ensure the component transitions to the full chat view and sends the user's input as the first message to the `/api/chatbot` endpoint.
- [x] 3.0 Code Deprecation: Remove the old `AISearchBar` and related assets.
  - [x] 3.1 Delete the component file: `web/src/components/AiSearchBar.js`.
  - [x] 3.2 Delete the corresponding test files: `web/src/components/AiSearchBar.test.js` and `web/src/components/AiSearchBar.integration.test.js`.
  - [x] 3.3 Clean up any remaining imports or references to the `AISearchBar` component in the codebase.
- [x] 4.0 Backend Adjustments: Ensure the backend handles the new flow and remove redundant APIs.
  - [x] 4.1 Review `api/routes/chatbot.js` and `api/agents/travelAgent.js` to confirm the initial message correctly starts the planning conversation.
  - [x] 4.2 Investigate `api/routes/search.js` to confirm it is made redundant by the new flow.
  - [x] 4.3 If redundant, remove the `search.js` route from the main API server and delete the file.
- [x] 5.0 Testing: Update and create tests to validate the new, unified experience.
  - [x] 5.1 Update unit tests for `Chatbot.js` to cover the new initial prompt state and submission logic.
  - [x] 5.2 Update integration tests in `App.integration.test.js` to assert the absence of `AISearchBar` and the presence of the new chatbot-centric UI.
  - [x] 5.3 Create or update an end-to-end test in the `cypress/e2e/` directory to cover the complete new user journey.
