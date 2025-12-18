# Workflow: Create Travel Product Requirement Document (PRD)

## 🎯 Goal
To guide the **Planner** and **Design Architect** in co-creating a high-fidelity PRD. This document serves as the "Source of Truth" for the **Implementer**, ensuring that technical logic and user experience are perfectly aligned for a travel context.

## 🔄 The Collaborative Process

1.  **Receive Initial Prompt**: User provides a feature request.
2.  **Discovery Phase (Mandatory)**: 
    * The **Design Architect** MUST lead the clarifying questions. 
    * Questions must focus on the **User Journey**, **Travel Intelligence** (e.g., price clarity), and **Mobile-First** constraints.
    * Use lettered/numbered lists for easy user selection.
3.  **Generate PRD**: Based on the sync between the Planner (Technical) and Design Architect (Product), generate the PRD using the "Travel-Enhanced Structure" below.
4.  **Save PRD**: Save as `tasks/[nnnn]-prd-[feature-name].md`.

## 🧭 Travel-Specific Clarifying Questions
*In addition to standard goals, the Architect must ask:*
* **Search Density**: "How much information should be visible at a glance? (A) Minimalist/Clean, (B) Data-Heavy/Professional."
* **Trust Factors**: "What pricing details are critical for the user to see before they click 'Book'?"
* **Offline/Low Connectivity**: "Should this feature work or show cached data if the user has a poor travel connection?"

## 📋 Travel-Enhanced PRD Structure

1.  **Overview**: Problem, Goal, and the "Job to be Done."
2.  **User Journey (The Happy Path)**: A step-by-step narrative of the frictionless travel experience.
3.  **Functional Requirements**: 
    * Numbered list of "The system MUST..." statements.
    * **State Management Requirements**: Explicitly define the UI for **Loading (Skeleton)**, **Empty (No Results)**, and **Error** states.
4.  **Travel Intelligence**:
    * **Information Hierarchy**: What data wins on a small screen?
    * **Transparency**: Requirements for taxes, fees, and cancellation policies.
5.  **Non-Goals**: Scope boundaries.
6.  **Design Gate Checklist**: Specific criteria the Design Architect will use during the **Visual QA** phase.
7.  **Success Metrics**: KPIs like "Conversion to Booking" or "Time to Search."

## 🎯 Target Audience
The reader is a **Junior Implementer Agent**. Requirements must be explicit regarding both logic and visual classes (Tailwind).

## 🛑 Final Constraints
1.  **Plan Only**: Do not implement.
2.  **Collaborative**: The Designer must sign off on the UX section.
3.  **Explicit Questions**: Do not assume; ask before drafting.