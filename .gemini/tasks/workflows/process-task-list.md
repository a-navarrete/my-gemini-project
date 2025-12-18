# Rule: Task List Execution & Design Gate Management

## 🎯 Goal
To guide the **Implementer Agent** through the disciplined execution of a task list, ensuring technical quality and adherence to the **Lead Product Designer's** standards.

## 🛠️ Task Implementation Protocol

### 1. Sequential Execution
- **One sub-task at a time**: Do **NOT** start the next sub‑task until the user provides permission ("yes" or "y").
- **Visual Checkpoint**: If a sub-task involves UI (Tailwind/HTML), you must verify the styling against the Design Architect's specs before marking it complete.

### 2. Completion & Gate Protocol
When you finish a **sub‑task**, immediately mark it as `[x]`. When **all** sub-tasks under a parent task are finished, follow this sequence:

1.  **Test Suite**: Run the full test suite (`npm test`, `vitest`, etc.).
2.  **Visual Audit (If UI Task)**: If the parent task was in the **UI/UX Build** phase:
    - You MUST notify the **Design Architect** to run a Playwright Audit.
    - You cannot mark the parent task `[x]` until the Architect provides a 🟢 **PASS**.
3.  **Clean up**: Remove temporary files, logs, or "lorem ipsum" text.
4.  **Stage & Commit**: Use conventional commit format:
    ```bash
    git commit -m "feat: implement flight card mobile layout" -m "- Added responsive Tailwind classes" -m "- Integrated Skeleton loader for wait state" -m "Design Gate: Pending Architect Audit"
    ```

### 3. Handling Rejection
If the **Design Architect** returns a 🟡 **NEEDS REVISION**:
- Add the Architect's feedback as new sub-tasks under the current Parent Task.
- Address these fixes before attempting to move to the next Parent Task.

---

## 📂 Task List Maintenance

1.  **Update "Relevant Files"**: Every time you create or modify a file, update the `Relevant Files` section in the task list with a one-line description.
2.  **Discovery**: If you realize a technical hurdle requires a new task (e.g., "Need to refactor API helper for currency conversion"), add it to the list immediately.

---

## 🤖 AI Instructions for the Implementer

1.  **Read-Check-Act**: Before starting work, confirm which sub-task is next.
2.  **The "Go" Rule**: After every sub-task, update the `.md` file and **pause**. Ask: *"Sub-task [X.X] complete. Proceed to [X.Y]?"*
3.  **The Design Dependency**: You are a partner to the **Design Architect**. If specs are missing or unclear, stop and ask the Architect for the specific Tailwind classes or layout rules.

---

## 📁 Output Format for Updates
When updating the task file, ensure the structure remains scannable:
- [x] 1.0 Parent Task (Completed)
- [ ] 2.0 Parent Task (In Progress)
  - [x] 2.1 Sub-task (Done)
  - [ ] 2.2 Sub-task (Next)