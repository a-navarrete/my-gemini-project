# Agent Orchestration Hub: AI Travel Assistant

## 🗺️ The Product-Led Orchestration Loop
Follow these stages sequentially based on the 'Gate Status' in `.gemini/tasks/context.md`:

### 1. Discovery & Strategy (The Handshake)
- **Goal**: Define the "What" and "Why."
- **Action**: Run `@./tasks/workflows/create-prd.md`.
- **Primary Agents**: **Planner** (Technical lead) & **Design Architect** (Product lead).
- **NEW: Data Discovery**: If the feature requires external data, the **API-Expert** must audit available endpoints and provide a 'Data Availability Report' to the **Design Architect**.

### 2. Planning & Design Gate
- **Goal**: Define the "How" and "Look."
- **Action**: Run `@./tasks/workflows/generate-tasks.md`.
- **Requirement**: The **Planner** cannot generate tasks until the **Design Architect** has defined the 'Happy Path' and the **API-Expert** has confirmed schema mapping.

### 3. Implementation (The Build)
- **Goal**: Execute the plan.
- **Action**: Run `@./tasks/workflows/process-task-list.md`.
- **Primary Agent**: **Implementer**.
- **Constraint**: Must follow the `ui-library.md` and `design-inspo.md` standards.

### 4. Verification & Audit (The Gatekeeper)
- **Goal**: Quality Control.
- **Primary Agents**: 
    - **Design Architect**: Runs the 'Visual QA Template' via Playwright.
    - **Reviewer**: Performs final code audit.
- **Outcome**: A 🟢 **PASS** status in `context.md` is required to close the feature.

---

## 🚦 Updated `@orchestrate` Logic
*Execute this logic to determine the next session move:*

1. **Check Context**: Read `.gemini/tasks/context.md`.
2. **Determine Phase**:
    - **IF no PRD**: Execute `@create-prd.md`.
    - **IF PRD exists but Data is unknown**: Ping **API-Expert** to create an `api-[feature].md` plan.
    - **IF Data is verified but Design is ⏳ PENDING**: Ping **Design-Architect** to define UI states based on API constraints.
    - **IF Design is ✅ APPROVED but Tasks are missing**: Execute `@generate-tasks.md`.
    - **IF Implementation is 🏗️ IN PROGRESS**: Ping **Implementer** for the next sub-task.
    - **IF Build is ✅ COMPLETE**: Ping **Design-Architect** for Playwright Visual QA.
3. **Log Update**: Sync all progress back to the Feature Pipeline in `context.md`.

---

## 🛠️ Context Flow & Agent Registry
@./tasks/context.md
@./design-inspo.md
@./ui-library.md

**Agents**:
@./agents/planner.md
@./agents/design-architect.md
@./agents/api-expert.md
@./agents/implementer.md
@./agents/reviewer.md

---

✅ _End of Orchestration Hub_