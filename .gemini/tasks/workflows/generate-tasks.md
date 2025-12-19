# Workflow: Generate Product-Driven Task List

## 🎯 Goal
To transform a PRD into a phased, actionable task list that enforces the **Design Gate** and utilizes the **Handoff Template**. This ensures the Implementer cannot deviate from the Design Architect's specifications.

## 📝 Pre-Requisites
1.  **PRD**: A finalized `prd-[nnnn].md` must exist in `/tasks/prd/`.
2.  **Handoff**: The Design Architect must have drafted a `handoff-[nnnn].md` in `/tasks/handoffs/`.
3.  **UI Library**: The `.gemini/ui-library.md` must be referenced for all component standards.

---

## 🔄 The Generation Process

### Phase 1: High-Level Phasing (Parent Tasks)
The Planner must generate 4-6 "Parent Tasks" that follow this mandatory lifecycle:
1.  **[Design Sync]**: UI preparation, Handoff review, and Component mapping.
2.  **[Core Logic]**: Data fetching, API integration, and State management.
3.  **[UI Build]**: Frontend implementation using `ui-library.md`.
4.  **[Visual QA]**: Playwright audit and Design Gate sign-off.
5.  **[Final Review]**: Code audit and Merge preparation.

**STOP**: Present these Parent Tasks to the user and wait for a "**Go**" before breaking them down into sub-tasks.

### Phase 2: Detailed Sub-Task Rules
When breaking down parent tasks, you **MUST** include these specific references and instructions:

#### **1. Linking the Handoff Specifications**
The very first sub-task under **[UI Build]** MUST be:
- [ ] Read and implement styles defined in `.gemini/tasks/handoffs/handoff-[feature-name].md`.

#### **2. Enforcing the UI Library**
Every frontend/UI sub-task must include a reference to the global standards:
- [ ] Apply Tailwind classes exclusively from `.gemini/ui-library.md`.

#### **3. Mandatory State Handling**
Sub-tasks must explicitly address the four UI states defined in the PRD:
- [ ] Implement **Skeleton Loader** (Loading State) per PRD/Handoff specs.
- [ ] Implement **Empty State** (No Results) per PRD/Handoff specs.
- [ ] Implement **Error State** (API Fail) per PRD/Handoff specs.

#### **4. The Visual QA Trigger**
The final sub-task under **[Visual QA]** MUST be:
- [ ] Summon **Design Architect** to run Playwright Audit against `handoff-[feature].md`.

---

## 📁 Output Format
The resulting file must be saved as: `.gemini/tasks/tasklists/tasks-[prd-filename].md`.

### Required Header Structure:
Every task list file must begin with this section:
```markdown
## 🔗 Relevant Files
- `tasks/prd/[filename].md` - Source Requirements
- `tasks/handoffs/handoff-[filename].md` - Design Specifications
- `ui-library.md` - Component Standards
- `design-inspo.md` - Visual Guidelines