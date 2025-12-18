# Rule: Generating a Product-Driven Task List from a PRD

## 🎯 Goal
To guide the **Planner** in creating a detailed, phased task list that ensures the **Implementer** follows the design specs and clears the **Design Gate** before completion.

## 📁 Output
- **Location**: `/tasks/`
- **Filename**: `tasks-[prd-file-name].md`

## 🔄 Phased Process

### Phase 1: Parent Task Generation (The PDLC Framework)
Analyze the PRD and codebase. You must generate 4-6 high-level Parent Tasks that follow this mandatory sequence:
1.  **[Design Sync]**: Preparation of UI components and Tailwind specs.
2.  **[Core Logic]**: Backend/API/State management implementation.
3.  **[UI/UX Build]**: Frontend implementation based on Architect's specs.
4.  **[Visual QA & Audit]**: Verification of the UI using Playwright.
5.  **[Final Review]**: Code audit and Design Gate sign-off.

**Wait for Confirmation**: Present these parent tasks and wait for the user to respond with "**Go**" before generating sub-tasks.

### Phase 2: Detailed Sub-Task Breakdown
Once confirmed, break down each parent task. You **must** include these specific sub-tasks:

* **In [Design Sync]**: 
    - [ ] Create/Update local design tokens or Tailwind config if necessary.
    - [ ] Define "Skeleton Loader" components for the Loading State.
* **In [UI/UX Build]**:
    - [ ] Implement Mobile-First responsive layouts (375px).
    - [ ] Apply "Travel Intelligence" (e.g., price transparency, clear CTAs).
* **In [Visual QA & Audit]**:
    - [ ] Run `playwright-mcp-server` to audit the Happy Path.
    - [ ] Capture Desktop and Mobile screenshots for the Design Architect.
    - [ ] Run Accessibility audit (`accessibility.snapshot()`).

## 📋 Output Format

```markdown
## 🔗 Relevant Files
- `path/to/file.tsx` - [Reason]
- `path/to/file.test.tsx` - [Tests]

### 💡 Implementation Notes
- Ensure the **Design Architect** provides the hex codes and spacing scales before starting Task 3.0.
- All travel data displays must handle "Price + Taxes" transparency.

## 🏁 Task List
- [ ] 1.0 [Design Sync] - Product Strategy & UI Specs
  - [ ] 1.1 Review PRD with Design Architect for "Happy Path" alignment.
  - [ ] 1.2 Identify reusable components from the existing design system.
- [ ] 2.0 [Logic] - API Integration & Data Handling
- [ ] 3.0 [UI/UX] - Interface Implementation (Mobile-First)
- [ ] 4.0 [Visual QA] - Playwright Audit & Gate Check
  - [ ] 4.1 Capturing Visual Evidence for Architect Review.
  - [ ] 4.2 Verifying Loading and Error states.
- [ ] 5.0 [Review] - Final Code & Product Sign-off

 ## 🎯 Target Audience
The reader is a Junior Implementer Agent. The list should be a recipe: if they follow every checkmark, the Reviewer Agent should find 0 errors.

## 🚦 Final Instructions
1. Do not skip the "Wait for Confirmation" step.

2. Ensure every task list has a "Visual QA" phase.

3. Reference the PRD states (Loading, Empty, Error) in the sub-tasks.