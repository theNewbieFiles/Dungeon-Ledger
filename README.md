# Dungeon Ledger

**Dungeon Ledger** is a **state-driven, agent-orchestrated virtual tabletop (VTT)** designed to support online tabletop RPG campaigns. It separates campaign authoring from live gameplay and integrates **goal-driven AI agents** that assist Dungeon Masters while remaining explicitly constrained by system state and human approval.

This project is intentionally designed as both:
- A **standalone product**, and
- A **portfolio demonstration of AI orchestration, agent governance, and system design**

---

## Core Concepts

Dungeon Ledger is built around a set of explicit architectural principles:

- **Campaign and session state machines**
- **Server-authoritative game state**
- **Human-in-the-loop AI**
- **Agent autonomy bounded by lifecycle state**
- **Persistent execution traces and memory**

AI is not treated as a feature or a black box, but as a **governed subsystem** that plans, executes, validates, and revises under supervision.

---

## High-Level Architecture

Dungeon Ledger is composed of the following major subsystems:

- **Frontend**: React-based client for Dungeon Masters and players
- **Backend API**: Node.js service enforcing permissions, state, and validation
- **Real-Time Engine**: WebSocket-based server-authoritative session runtime
- **AI Orchestration Engine**:
  - Goal intake
  - Planning
  - Agent delegation
  - Validation and critique loops
- **Persistence Layer**: PostgreSQL (including structured artifacts and execution history)
- **Asset Storage**: Object storage for maps, tokens, and media

AI agents never mutate live game state directly.

---

## Campaign & Session State Model

Dungeon Ledger enforces a strict separation between **authoring** and **runtime** contexts.

### Campaign Phases

- `DRAFT` – Campaign content under construction
- `READY` – Campaign prepared and awaiting play
- `ACTIVE` – Campaign with completed sessions
- `COMPLETED` – Narrative finished
- `ARCHIVED` – Read-only

### Session States

- `NOT_STARTED`
- `RUNNING`
- `PAUSED`
- `ENDED`

These states drive:
- UI availability
- Permissions
- Agent behavior
- Backend validation

---

## AI Orchestration Model

Dungeon Ledger implements **goal-driven AI orchestration**, not single-shot generation.

### Orchestration Flow

1. The DM defines a **goal** (e.g., “Create a session map and encounters”)
2. A **Planner Agent** decomposes the goal into executable steps
3. Specialized agents execute tasks:
   - Map Agent
   - NPC Agent
   - Item Agent
4. Outputs pass through:
   - Schema validation
   - Rules validation
   - Critic / balance review
5. The DM reviews, edits, or approves results
6. Approved artifacts are persisted with full traceability

All plans, agent runs, revisions, and approvals are stored.

---

## Human-in-the-Loop by Design

Dungeon Masters remain the **final authority** at all times.

DMs can:
- Approve or reject AI-generated plans
- Modify constraints
- Re-run individual agent steps
- Lock artifacts against further AI changes

AI autonomy is intentionally **reduced or disabled** during live sessions.

---

## Authoring Tools

Dungeon Ledger includes structured tools used by both humans and agents:

### Map Editor
- Grid- and tile-based
- Versioned artifacts
- AI-assisted layout proposals

### Item Creator
- Template-driven
- Balance validation
- System tagging

### NPC Creator
- Narrative and mechanical generation
- Dialogue hooks
- Encounter roles

Agents use these tools; they do not bypass them.

---

## Real-Time Session Engine

During live play:
- The server is authoritative
- State updates are deterministic
- All player actions are validated
- AI is limited to DM-invoked, narrow-scope assistance

Supported actions include:
- Token movement
- Dice rolls
- Fog-of-war updates
- Encounter triggers

---

## Why This Project Exists

Dungeon Ledger was created to explore and demonstrate:

- **AI orchestration**
- **Agent planning and delegation**
- **State-constrained autonomy**
- **Human–AI collaboration**
- **Observable and explainable AI systems**

This project deliberately avoids “AI magic buttons” in favor of transparent, auditable workflows.

---

## Project Status

Dungeon Ledger is under active development.

Current focus:
- Campaign and session state enforcement
- Orchestration engine MVP
- One fully implemented agent with a validation loop
- DM-facing authoring workflows

---

## License

**All rights reserved.**

This repository is intentionally not open-source.  
The code is provided for viewing and evaluation purposes only.  
No permission is granted to use, copy, modify, or distribute without explicit written consent.

---

## About the Author

Dungeon Ledger is designed and built by **Christopher Wilson** as a long-term project exploring advanced system design and AI orchestration.

If you are reviewing this project and would like to discuss architecture, design decisions, or implementation details, feel free to reach out.
