# CLAUDE.md - ChiCanDoIt Project

## Project Overview
ChiCanDoIt is an AI-powered daily agenda tracker that helps users stay accountable and complete their tasks through intelligent insights and real-time notifications. This is a Tauri desktop application with a React frontend and Rust backend.

## Important Project Documents
- **Project Specification**: `PROJECT_SPEC.md` - Complete technical architecture and feature specifications
- **Task Tracker**: `TASK_TRACKER.md` - Development roadmap with 8-week timeline and task breakdowns
- **Project Brief**: `PROJECT_BRIEF.md` - Executive summary, market analysis, and business strategy

## Package Manager
**ALWAYS use `bun` instead of `npm` for this project:**
- Install dependencies: `bun install`
- Run Tauri development: `bun run dev` or `bun tauri:dev`
- Build desktop app: `bun run build:desktop` or `bun tauri:build`

## Project Structure
```
chicandoit/
├── src/                  # Frontend React/Next.js code
│   └── components/       # React components
├── src-tauri/           # Rust backend for Tauri
│   ├── src/             # Rust source code
│   ├── Cargo.toml       # Rust dependencies
│   └── tauri.conf.json  # Tauri configuration
├── src-backup/          # Previous web-based implementation
│   ├── components/      # React components
│   └── server/         # Node.js backend (archived)
├── public/              # Static assets
├── PROJECT_SPEC.md      # Technical specifications
├── TASK_TRACKER.md      # Development roadmap
└── PROJECT_BRIEF.md     # Business overview
```

## Key Technologies
- **Frontend**: React 18, Next.js, TailwindCSS
- **Backend**: Tauri (Rust), with AI integrations
- **Desktop Framework**: Tauri v1.5
- **Package Manager**: Bun (not npm)

## Development Commands
```bash
# Install dependencies
bun install

# Run Tauri in development mode
bun run dev
# or
bun tauri:dev

# Build desktop application
bun run build:desktop
# or
bun tauri:build
```

## Environment Setup
1. Make sure Rust is installed (required for Tauri)
2. Copy `.env.example` to `.env` (if exists)
3. Add your API keys:
   - OpenAI API key
   - Gmail OAuth credentials
   - Discord bot token

## Current Development Phase
As per `TASK_TRACKER.md`, we are currently in:
- **Phase 1**: MVP Foundation (Weeks 1-2)
- **Status**: Transitioning from web to desktop architecture

## Architecture Pattern
The project is transitioning from a web-based architecture to a Tauri desktop application:
- **Frontend**: React/Next.js in the `src/` directory
- **Backend**: Rust-based Tauri in `src-tauri/` directory
- **Previous Implementation**: Web-based Node.js backend archived in `src-backup/`

## Important Notes
- This is a Tauri desktop application, not a web app
- The Rust linting errors are expected - Rust code is in `src-tauri/`
- Use `bun` for all package management commands
- The web-based implementation has been moved to `src-backup/` for reference

## Next Steps
1. Integrate the domain-driven design from the web version into Tauri
2. Set up IPC (Inter-Process Communication) between React and Rust
3. Implement local storage using Tauri's file system APIs
4. Add system tray integration for notifications

## Development Commands
```bash
# Install dependencies
bun install

# Run both frontend and backend
bun run dev

# Run frontend only (port 3000)
bun start

# Run backend only (port 3001)
bun run server

# Build for production
bun run build
```

## Environment Setup
1. Copy `.env.example` to `.env`
2. Add your API keys:
   - OpenAI API key
   - Gmail OAuth credentials
   - Discord bot token

## Current Development Phase
As per `TASK_TRACKER.md`, we are currently in:
- **Phase 1**: MVP Foundation (Weeks 1-2)
- **Status**: Week 1 complete, Week 2 in progress

## Architecture Pattern
The project follows Domain-Driven Design with these core domains:
1. **TaskManager**: Task CRUD and persistence
2. **CommunicationIntegrator**: External service connections
3. **AIAnalysisEngine**: OpenAI-powered insights
4. **NotificationSystem**: Real-time alerts and reminders

## Testing & Quality
- Use `bun test` for running tests (when implemented)
- ESLint is configured for code quality
- Follow the code style in existing files

## Important Notes
- Real-time updates use Socket.IO WebSockets
- Tasks are persisted to `data/tasks.json`
- AI insights require OpenAI API key in `.env`
- Gmail/Discord integrations need proper OAuth setup

## Next Steps
Refer to `TASK_TRACKER.md` for current development priorities and upcoming tasks.