# PRD: Conversational Flight Search (MVP)

## 1. Introduction/Overview

This document outlines the requirements for a new **conversational flight search** feature. Based on user feedback, we are pivoting from improving the existing visual UI to developing a chat-based experience. The goal is to create a fast, efficient, and intuitive way for users to find flights by interacting with an AI travel agent. This feature will serve as the foundational first step towards building a comprehensive, multi-faceted travel agent capable of handling flights, hotels, and tours.

The primary driver for this feature is to address user feedback that the current design feels outdated and to deliver a faster, more efficient search process.

## 2. Goals

*   **Primary Goal**: To allow users to find flights using a natural language chat interface, making the process faster and more efficient.
*   **Secondary Goal**: To improve the clarity of flight results by explicitly showing different fare options (e.g., basic vs. main cabin, baggage info).
*   **Business Goal**: To establish the foundation for a powerful, conversational AI travel agent, increasing user engagement and setting our product apart.

## 3. User Stories

*   As a user, I want to type a query like "find flights from SFO to JFK next week for 2 people" and receive a list of relevant flight options directly in the chat.
*   As a user reviewing flight options, I want to clearly see the differences between fare classes (like Basic Economy and Main Cabin) and their associated baggage allowances so I can make an informed decision.
*   As a user, I want to be able to refine my search with follow-up messages like "show me only non-stop flights" or "what are the prices for the next day?" and have the agent understand the context.
*   As a user, when I provide an ambiguous query like "flights to New York", I want the agent to ask clarifying questions (e.g., "Which airport in New York? JFK, LaGuardia, or Newark?").

## 4. Functional Requirements

1.  **Chat Interface**: The system must provide a primary chat interface for users to enter natural language queries.
2.  **NLP Parsing**: The system must parse user queries to extract key flight search parameters (e.g., origin, destination, dates, number of passengers).
3.  **Contextual Conversation**: The chat agent must maintain context throughout a conversation, allowing users to iteratively refine their search results.
4.  **Structured Results**: Flight results must be presented in a structured, easy-to-read format within the chat (e.g., as interactive cards).
5.  **Fare Transparency**: Each flight result card must clearly display different fare options (e.g., Basic, Main), including key attributes like baggage allowance and seat selection rules.
6.  **Clarification Prompts**: The agent must be able to recognize ambiguous queries and ask the user for clarification.
7.  **Inspiration from Kayak**: The *types* of data and filtering capabilities available on Kayak should serve as a benchmark for what the chat agent can understand and display (e.g., stops, duration, airline).

## 5. Non-Goals (Out of Scope)

*   **Booking**: This MVP will focus exclusively on **search and discovery**. Users will not be able to book flights from the chat interface in this iteration.
*   **Other Travel Verticals**: The feature will be limited to flights only. Hotels, experiences, and tours are out of scope for this initial build.
*   **Visual UI**: There will be no separate, graphical user interface for search. The experience will be chat-first.
*   **User Profiles**: The agent will not store user preferences or past search history in this version.

## 6. Design Considerations

*   **Conversational UI**: The chat interface itself should be clean, modern, and easy to use.
*   **Flight Result Cards**: These cards are the core of the UI. They must be designed to be information-dense yet highly readable on both desktop and mobile, adhering to the principles in `.gemini/ui-library.md`.
*   **Interactive Elements**: The chat results should include simple buttons or quick replies for common refinements (e.g., "Sort by Price", "Non-stop only").

## 7. Technical Considerations

*   A robust Natural Language Processing (NLP) service is required. The existing `nlpAgent.js` may serve as a starting point, but it will likely need significant enhancement to support contextual conversation.
*   The backend will need to integrate with flight search APIs and normalize the data for presentation in the chat format.
*   A state management solution for tracking the conversational context for each user session will be necessary.

## 8. Success Metrics

*   **Task Completion Rate**: Percentage of users who successfully receive relevant flight options after starting a conversation.
*   **Efficiency**: Reduction in the average time taken from initial query to finding a suitable flight option.
*   **User Satisfaction**: High ratings on post-interaction feedback surveys ("Was this helpful?").

## 9. Open Questions

*   How will we hand off the user from discovery (in chat) to booking (on a third-party site or a separate page)?
*   What is the escalation path if the chatbot cannot understand a user's query after multiple attempts?
