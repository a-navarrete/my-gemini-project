# PRD: Unified Chatbot Experience

## 1. Introduction/Overview

This document outlines the requirements for a significant enhancement to the user experience of the AI Travel Assistant. The current interface presents users with both a search bar (`AISearchBar`) and a separate chatbot, which can lead to confusion.

This feature will unify these two functionalities into a single, seamless conversational interface. The goal is to create a more intuitive, engaging, and efficient user journey by making the chatbot the sole entry point for all travel planning activities.

## 2. Goals

-   **Simplify the User Experience:** Reduce user confusion by providing a single, clear starting point for trip planning.
-   **Increase User Engagement:** Make the interface more conversational and guide users through the planning process, encouraging them to complete their booking.
-   **Improve Technical Architecture:** Streamline the frontend and backend by removing redundant components and API endpoints, leading to a cleaner codebase.

## 3. User Stories

-   As a user, I want to have a single, continuous conversation for all my travel planning needs, so I don't have to switch between different interfaces.
-   As a new user, I want to be greeted with a single, simple question so that I know exactly how to start planning my trip without feeling overwhelmed.
-   As a user, I want the chatbot to intelligently guide me through the planning process, asking for necessary details so I don't forget anything important.

## 4. Functional Requirements

1.  **Remove the AISearchBar:** The `AISearchBar` component must be completely removed from the application's user interface.
2.  **Initial User Prompt:**
    -   On landing on the main page, the user must be presented with a single, prominent text prompt with the placeholder text: "Where are we traveling to?".
    -   This prompt will serve as the starting point for all user interactions.
3.  **Initiate Chatbot Conversation:**
    -   When a user enters text into the initial prompt and submits it, a full-screen chatbot session must be initiated.
    -   The text entered by the user will serve as the first message in the conversation.
4.  **Handle Ambiguous Input:** If the user's initial input is ambiguous (e.g., "I want to go somewhere warm"), the chatbot must ask clarifying questions to help the user specify a destination (e.g., "What kind of 'warm' are you looking for? A beach, a city, etc.?").
5.  **Preserve Existing Functionality:** All existing chatbot capabilities (e.g., flight search, hotel search, interactive buttons, result formatting) must be fully functional within the new, unified flow.
6.  **Deprecate Redundant Endpoints:** The API endpoint(s) used exclusively by the old `AISearchBar` (e.g., a legacy `/api/search` endpoint) must be disabled or removed.

## 5. Non-Goals (Out of Scope)

-   This feature will not include support for multi-destination trips in its initial version.
-   This feature will not include proactive, unsolicited suggestions from the chatbot (e.g., "I see you're going to Paris, would you like to book a museum tour?").

## 6. Design Considerations

-   The initial screen should be clean, modern, and focused, drawing the user's attention directly to the single input prompt.
-   The transition from the initial prompt to the full chatbot view should be smooth and seamless.

## 7. Technical Considerations

-   The existing CrewAI infrastructure will be leveraged to handle the conversational logic.
-   The frontend application (`App.js`) will need to be refactored to remove the `AISearchBar` and feature the `Chatbot` component more prominently.
-   A review of backend routes should be conducted to identify and remove any APIs that are made redundant by this change.

## 8. Success Metrics

The success of this feature will be measured by:
-   An increase in the number of users who initiate a travel search.
-   An increase in the overall conversion rate (the percentage of users who book a flight or hotel).
-   A decrease in the user drop-off rate after the first interaction.
-   Positive user feedback and satisfaction surveys.

## 9. Open Questions

-   None at this time.
