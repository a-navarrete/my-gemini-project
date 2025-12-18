# AI Travel Assistant – Main Orchestrator

## Context Flow
@./tasks/context.md
@./tasks/workflows/create-prd.md
@./tasks/workflows/generate-tasks.md
@./tasks/workflows/process-task-list.md

## Agents
@./agents/planner.md
@./agents/implementer.md
@./agents/reviewer.md
@./agents/api-expert.md
@./agents/design-architect.md

---

### 🚀 Next Steps (Orchestration Pipeline)
- [ ] **Strategy**: Planner & Design-Architect sync to define User Journey/Happy Path.
- [ ] **Specs**: Design-Architect provides Tailwind/UX specs to Implementer.
- [ ] **Development**: Implementer builds the feature logic.
- [ ] **Visual QA**: Design-Architect captures Playwright screenshots for audit.
- [ ] **Final Review**: Reviewer Agent verifies Code Quality + Design Gate status.

---

### 📁 Context Update (PDLC Tracking)
*Append this summary to `.gemini/tasks/context.md`:*

Update – [Feature/Ticket ID]
- **Design Gate Status**: [🟢 Pass / 🟡 Revision / ⏳ Pending]
- **Agents Involved**: <list names>
- **Blockers**: <Mention if UI Specs or API data are missing>
- **Next Step**: <Move to Implementation / Return for Visual Fixes>

---

### 🧩 Session Metadata
- **Run Mode**: Plan / Implement / Review / Visual-QA
- **Design Checkpoint**: [Initial Strategy / Mid-Build / Final Audit]
- **Context Snapshot**: @./tasks/context.md

---

✅ _End of Orchestration Cycle_