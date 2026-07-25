# Dungeon Ledger
 
**Status: Early-stage, actively building.** The auth system and the frontend request/middleware pipeline are implemented and working. The AI orchestration engine, map/item/NPC editors, and real-time session logic described below are the design target — they are **not built yet**. See [Built So Far](#built-so-far) vs. [Design Vision](#design-vision-not-yet-built) below.
 
**Dungeon Ledger** is a **state-driven, agent-orchestrated virtual tabletop (VTT)** I'm designing to support online tabletop RPG campaigns. The goal is to separate campaign authoring from live gameplay and integrate **goal-driven AI agents** that assist Dungeon Masters while remaining explicitly constrained by system state and human approval.
 
This project is intended as both:
- A **standalone product**, and
- A **portfolio demonstration of AI orchestration, agent governance, and system design**
---
 
## Built So Far
 
What's actually implemented and running today:
 
- **Authentication system** — JWT-based login/logout with access + refresh token flow, session handling, on both backend and frontend
- **Frontend request pipeline** — a composable middleware chain (token manager, auth link, JSON link, URL builder, fetch link) that orchestrates all API requests
- **App shell** — React frontend with routing/navigation, dashboard, landing page, and signup flow
- **Shared event bus** — a cross-package pub/sub system coordinating frontend state
- **WebSocket connection** — server accepts connections and echoes messages back; this is a proof-of-concept only, with no game state or session logic behind it yet
Everything below this point is design intent, not implemented functionality.
 
---
 
## Design Vision (Not Yet Built)
 
The rest of this document describes the system I'm designing toward. None of it exists in code yet.
 
### Core Concepts
 
Dungeon Ledger is being designed around a set of explicit architectural principles:
 
- **Campaign and session state machines**
- **Server-authoritative game state**
- **Human-in-the-loop AI**
- **Agent autonomy bounded by lifecycle state**
- **Persistent execution traces and memory**
The intent is for AI to never be a feature or a black box, but a **governed subsystem** that plans, executes, validates, and revises under supervision.
 
### High-Level Architecture
 
Dungeon Ledger is planned to be composed of the following major subsystems:
 
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
A hard design constraint: AI agents will never mutate live game state directly.
 
### Campaign & Session State Model
 
The plan is for Dungeon Ledger to enforce a strict separation between **authoring** and **runtime** contexts.
 
**Campaign Phases (planned)**
- `DRAFT` – Campaign content under construction
- `READY` – Campaign prepared and awaiting play
- `ACTIVE` – Campaign with completed sessions
- `COMPLETED` – Narrative finished
- `ARCHIVED` – Read-only
**Session States (planned)**
- `NOT_STARTED`
- `RUNNING`
- `PAUSED`
- `ENDED`
These states are intended to drive:
- UI availability
- Permissions
- Agent behavior
- Backend validation
### AI Orchestration Model
 
The design calls for **goal-driven AI orchestration**, not single-shot generation.
 
**Planned orchestration flow:**
1. The DM defines a **goal** (e.g., "Create a session map and encounters")
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
All plans, agent runs, revisions, and approvals are intended to be stored for full traceability.
 
### Human-in-the-Loop by Design
 
The design keeps Dungeon Masters as the **final authority** at all times.
 
Once built, DMs will be able to:
- Approve or reject AI-generated plans
- Modify constraints
- Re-run individual agent steps
- Lock artifacts against further AI changes
AI autonomy is intended to be reduced or disabled entirely during live sessions.
 
### Authoring Tools
 
Dungeon Ledger is planned to include structured tools used by both humans and agents:
 
**Map Editor**
- Grid- and tile-based
- Versioned artifacts
- AI-assisted layout proposals
**Item Creator**
- Template-driven
- Balance validation
- System tagging
**NPC Creator**
- Narrative and mechanical generation
- Dialogue hooks
- Encounter roles
The design intent is for agents to use these tools rather than bypass them.
 
### Real-Time Session Engine
 
During live play, the plan is for:
- The server to be authoritative
- State updates to be deterministic
- All player actions to be validated
- AI to be limited to DM-invoked, narrow-scope assistance
Planned supported actions include:
- Token movement
- Dice rolls
- Fog-of-war updates
- Encounter triggers
### Why This Project Exists
 
Dungeon Ledger was started to explore and demonstrate:
 
- **AI orchestration**
- **Agent planning and delegation**
- **State-constrained autonomy**
- **Human–AI collaboration**
- **Observable and explainable AI systems**
The project deliberately avoids "AI magic buttons" in favor of transparent, auditable workflows — that's the point of building it this way rather than reaching for a faster demo.
 
---
 
## Project Status
 
Dungeon Ledger is under active, early-stage development. Auth and the request pipeline are done; everything else above is design work in progress.
 
**Current focus:**
- Campaign and session state enforcement
- First working version of the orchestration engine (single agent + validation loop)
- DM-facing authoring workflows
---
 
## About the Author
 
Dungeon Ledger is designed and built by Chris Wilson as a long-term project exploring advanced system design and AI orchestration.
 
If you're reviewing this project and want to discuss architecture, design decisions, or implementation details — including what's built vs. what's planned — feel free to reach out.
