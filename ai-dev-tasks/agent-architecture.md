# Agent-Based Architecture

This document outlines the agent-based architecture used in the AI Travel Assistant backend. This architecture is designed to be modular and scalable, allowing for new capabilities to be added easily by creating new agents.

## Overview

The architecture is centered around the concept of "agents". An agent is a specialized worker that is responsible for a single, discrete task. For example, we have agents for parsing language, finding flights, and processing payments.

These agents are managed by an "orchestrator" agent, which is responsible for chaining the agents together in the correct order to fulfill a user's request.

## Existing Agents

The following agents are currently implemented in the `api/agents/` directory:

-   **`nlpAgent.js`**:
    -   **Role:** Natural Language Query Analyst
    -   **Goal:** Extract structured travel parameters from a user's query.
-   **`flightAgent.js`**:
    -   **Role:** Flight Options Specialist
    -   **Goal:** Find available flights based on given parameters.
-   **`hotelAgent.js`**:
    -   **Role:** Accommodation Specialist
    -   **Goal:** Find available hotels based on given parameters.
-   **`paymentAgent.js`**:
    -   **Role:** Payment Processor
    -   **Goal:** To process a payment and return a transaction ID.
-   **`bookingAgent.js`**:
    -   **Role:** Booking Specialist
    -   **Goal:** To persist a validated booking into the database.

## The Orchestrator

The `bookingOrchestratorAgent.js` is the main entry point for the agent workflow. It has two main methods:

-   `search(query)`: Takes a user's natural language query, uses the `nlpAgent` to parse it, and then uses the `flightAgent` and `hotelAgent` to find relevant options.
-   `book(bookingDetails)`: Takes the details of the flight, hotel, user, and payment, and uses the `paymentAgent` and `bookingAgent` to process the booking.

## Creating a New Agent

To add new functionality (e.g., for car rentals or activities), you can create a new agent. Here are the steps:

1.  **Create the agent file:** Create a new file in the `api/agents/` directory (e.g., `carRentalAgent.js`).
2.  **Define the agent:** The agent should be an object with a `role`, a `goal`, and an `execute` method. The `execute` method should contain the core logic for the agent's task.

    ```javascript
    /** @type {CarRentalAgent} */
    const carRentalAgent = {
      role: 'Car Rental Specialist',
      goal: 'Find available rental cars based on given parameters.',
      execute: (destination, dates) => {
        // ... logic to find rental cars
      }
    };

    export default carRentalAgent;
    ```

3.  **Integrate into the orchestrator:** Import the new agent into the `bookingOrchestratorAgent.js` and add a new method or modify an existing one to use the new agent in the workflow.
