# PRD: Unified Travel Agent (MVP)

## 1. Overview

This document outlines the requirements for the Minimum Viable Product (MVP) of the **Unified Travel Agent**. The vision is to create a single, conversational assistant—similar in feel to ChatGPT or Claude—that functions as an all-in-one platform for booking and organizing travel.

This solves a core user problem: the fragmented and time-consuming process of using different websites to book flights, hotels, tours, and other parts of a trip. This agent will be the unified, intelligent system responsible for creating seamless travel experiences.

## 2. User Journey (The Happy Path for MVP)

1.  **User Initiates**: "Plan a weekend trip to Napa Valley for me and a guest next month."
2.  **Agent Clarifies**: "I can certainly do that. Do you have a budget per person, say around $1000, $1500, or $2000?"
3.  **User Refines**: "Let's aim for $1500."
4.  **Agent Presents Packages**: "Great. I have found three packages that include round-trip flights from your home airport (SFO) and a 2-night stay at a highly-rated hotel. Here are the options:"
    *   *(The agent displays 3 distinct cards, each representing a combined Flight + Hotel package with a single price.)*
5.  **User Selects**: "Option 2 looks perfect. Book it."
6.  **Agent Executes Booking**: The agent directs the user through a single, unified checkout process for the entire package.
7.  **Agent Confirms**: "All set! Your weekend trip to Napa is booked. You can view your complete itinerary here."

## 3. Functional Requirements (MVP)

1.  **Conversational Interface**: The system MUST provide a primary chat interface for all user interactions.
2.  **Multi-Domain Understanding**: The agent's NLP MUST understand queries that combine multiple travel domains (e.g., "flights AND hotels").
3.  **MVP Scope: Flights & Hotels**: For the MVP, the agent's booking capabilities will be strictly limited to **flights** and **hotels**.
4.  **Package Creation**: The backend logic MUST be able to query for flights and hotels separately and then combine them into logical "packages" to present to the user.
5.  **Unified Checkout**: The system MUST support a single checkout flow that processes the payment for a combined flight and hotel package in one transaction.
6.  **Basic Itinerary Generation**: Upon successful booking, the system MUST generate a simple, viewable itinerary that includes details for both the flight and the hotel.
7.  **Price Trend Indication**: The agent MUST be able to display a simple price trend indicator (e.g., a small graph or a "Good time to buy" badge) alongside flight package results. This requires a data source for historical pricing.
8.  **State Management**: The UI MUST have clearly defined states for **Loading** (e.g., "Searching for packages..."), **Empty** ("I couldn't find any packages for those dates."), and **Error** ("Sorry, one of our booking partners is unavailable right now.").

## 4. Travel Intelligence (MVP)

*   **Information Hierarchy**: When presenting packages, the total combined price, hotel name, and flight times must be the most prominent pieces of information.
*   **Transparency**: The displayed package price MUST be the "total price," including all known taxes and fees. A tooltip or expandable section should be available to see the price breakdown.
*   **Data Display**: The UI should favor a **Data-Heavy & Professional** style, allowing users to see and compare details easily, similar to the philosophy of Kayak.

## 5. Non-Goals (MVP)

*   **Other Verticals**: Tours, rental cars, and activities are explicitly out of scope for the MVP.
*   **Complex Itinerary Management**: The MVP will not support modifying/canceling individual parts of a booked package (e.g., changing only the flight).
*   **Deep User Personalization**: The agent will not use a user's past travel history to inform its recommendations in the MVP.

## 6. Design Gate Checklist (for Visual QA)

*   The UI for presenting distinct travel "packages" must be clear and easy to compare.
*   The unified checkout flow must feel secure and trustworthy, using brand colors and clear labeling.
*   All price displays must use a tabular-figure font for alignment.
*   The price trend indicator must be visually intuitive and not clutter the main results.
*   The transition from chat to the checkout flow must be seamless.

## 7. Success Metrics (MVP)

*   **Package Booking Rate**: The number of successful flight + hotel package bookings per week.
*   **User Satisfaction (CSAT)**: High scores on a post-booking survey asking, "How easy was it to plan your trip?"
*   **Time to Book**: A measurable reduction in the time from the user's initial query to a completed booking compared to user research benchmarks.
