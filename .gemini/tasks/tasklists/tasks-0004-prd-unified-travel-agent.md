# Task List: Unified Travel Agent (MVP)

## 🔗 Relevant Files
- `tasks/prd/0004-prd-unified-travel-agent.md` - Source Requirements
- `tasks/handoffs/handoff-0004-unified-travel-agent.md` - Design Specifications
- `.gemini/ui-library.md` - Component Standards
- `.gemini/design-inspo.md` - Visual Guidelines

---

## Tasks

- [ ] 1.0 **[Design Sync]**: Review Handoff Specifications and Prepare for Build
  - [x] 1.1 Review the PRD and the Design Handoff file to ensure a full understanding of the feature requirements.
  - [x] 1.2 Identify all existing components (`Chatbot`, `nlpAgent`, `flightAgent`, `hotelAgent`) that can be reused or will need modification.
  - [ ] 1.3 Add the `brand-primary` and `brand-accent` colors to the `tailwind.config.js` file to make them available as utility classes.

- [ ] 2.0 **[Core Logic]**: Implement Backend Orchestration for Travel Packages
  - [ ] 2.1 Enhance `nlpAgent` to understand queries combining "flights" and "hotels" (e.g., "trip to SF with a hotel").
  - [ ] 2.2 Modify the main `travelAgent` orchestrator to call both the `flightAgent` and `hotelAgent` when a multi-domain query is detected.
  - [ ] 2.3 Create a new "packaging" agent/service that takes the results from the flight and hotel agents and combines them into logical packages with a single, total price.
  - [ ] 2.4 Implement the "Price Trend Indicator" logic, which for the MVP can be a mocked service that randomly assigns a "Good deal" status to some packages.
  - [ ] 2.5 Ensure the final API response from `/api/chatbot` can include a `packages` array, containing the structured package data.

- [ ] 3.0 **[UI Build]**: Implement the `PackageResultCard` and Associated UI States
  - [ ] 3.1 **Read and implement styles defined in `.gemini/tasks/handoffs/handoff-0004-unified-travel-agent.md`.**
  - [ ] 3.2 Create the new `web/src/components/PackageResultCard.js` component, applying Tailwind classes exclusively from `.gemini/ui-library.md` and the handoff file.
  - [ ] 3.3 Create the corresponding `PackageResultCard.test.js` and write unit tests.
  - [ ] 3.4 In `Chatbot.js`, add the logic to detect a `packages` array in a bot message and render a list of `PackageResultCard` components.
  - [ ] 3.5 Implement the **Skeleton Loader** (Loading State) by creating a skeleton version of the `PackageResultCard` and displaying it while the backend is searching, as per the handoff specs.
  - [ ] 3.6 Implement the **Empty State** (No Results) by rendering a simple text message from the bot when no packages are found.
  - [ ] 3.7 Implement the **Error State** (API Fail) by rendering the bot's error message.

- [ ] 4.0 **[Visual QA]**: Audit Implementation Against Design Handoff
  - [ ] 4.1 Perform an end-to-end test of the "Happy Path" by searching for a trip and ensuring the `PackageResultCard` components render correctly with the mocked data.
  - [ ] 4.2 Verify that the loading, empty, and error states appear correctly based on the mocked API responses.
  - [ ] 4.3 **Summon Design Architect to run Playwright Audit against `handoff-0004-unified-travel-agent.md`.**

- [ ] 5.0 **[Final Review]**: Code Review, Cleanup, and Merge Preparation
  - [ ] 5.1 Review all new and modified code for correctness, style, and adherence to project conventions.
  - [ ] 5.2 Remove any temporary or mock data used for testing the UI.
  - [ ] 5.3 Stage all changes and prepare a comprehensive commit message.
