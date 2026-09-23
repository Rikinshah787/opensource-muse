# OpenSource Muse

OpenSource Muse is a public, self-hostable agent workbench for people who want their AI tools in the open: chat, tasks, browser sessions, files, approvals, and a new **Studio** surface for turning rough ideas into runnable agent work.

It is built for builders, researchers, operators, and indie hackers who want to inspect the stack instead of renting a mystery assistant.

[Live demo](https://museopensource.rikin-shah158023.chatgpt.site) · [Launch plan](LAUNCH.md) · [Roadmap](ROADMAP.md) · [Contributing](CONTRIBUTING.md)

[![CI](https://github.com/Rikinshah787/opensource-muse/actions/workflows/ci.yml/badge.svg)](https://github.com/Rikinshah787/opensource-muse/actions/workflows/ci.yml)
[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Why this exists

Most agent products hide the interesting parts: plans, tool calls, browser state, approvals, memory, retries, and the boundary between “suggested” and “done.”

OpenSource Muse goes the other way. It is meant to be forked, audited, extended, and run by the people using it.

## What makes it different

| Difference | What it means |
| --- | --- |
| **Studio-first workflow** | A dedicated Studio tab helps shape project briefs into concrete agent prompts with launch notes and reusable angles. |
| **Visible work** | Tasks, plans, approvals, files, browser results, and receipts are visible instead of buried in a chat transcript. |
| **Human review by default** | External writes become reviewable drafts and proposals before they are sent or executed. |
| **Self-hostable architecture** | Server, worker, browser service, mobile/web UI, and domain packages live in this repo. |
| **Local sample mode** | You can run the app without model keys, Google accounts, Docker, or paid services just to understand the flow. |
| **Agent computer path** | Optional browser and Linux workspace pieces are separated so you can reason about their trust boundaries. |
| **Original identity** | OpenSource Muse ships a new spark mascot and open-source positioning instead of the upstream animal mascot/branding. |

## Features

- Chat interface for delegated work and follow-up prompts.
- Studio tab for shaping rough intent into agent-ready tasks.
- Durable activity view for plans, approvals, progress, and receipts.
- Ideas, goals, and monitors for longer-running work.
- Browser sessions with preview/takeover support when the worker is configured.
- Files and PDF workflows, including document import and review.
- Gmail and Calendar adapters for live workspaces.
- Finance CSV import demo for structured artifacts.
- Optional Linux workspace container for bounded command/file work.
- Rich thread persistence when configured with CopilotKit Intelligence.

## Quick start

Requirements:

- Node 24 LTS
- pnpm 11.19.0

```sh
git clone https://github.com/Rikinshah787/opensource-muse.git
cd opensource-muse
pnpm install --frozen-lockfile
cp .env.example .env
pnpm dev
```

In another terminal:

```sh
pnpm dev:web
```

Open:

- App: http://localhost:8081
- API health: http://localhost:8787/api/health

## Try first

1. Open **Studio** and turn a rough project brief into a concrete agent task.
2. In **Chat**, ask: `Complete the permission slip`.
3. Open the generated task, inspect the plan, and review the prepared output.
4. Try **Goals → Track** for a recurring public-page check.
5. Try **Menu → Delegate task → Finance** with the example transactions.

The sample app uses local fictional data, so you can explore the system before connecting real accounts.

## Configure live agent work

Copy `.env.example` to `.env`, then configure only what you need.

For model-backed work:

```env
AGENT_BACKEND=model
MODEL=provider/model-id
```

Set the matching provider key on the server. Provider keys should never be exposed to the client.

For live mail/calendar:

```env
WORKSPACE_MODE=live
OPENSOURCE_MUSE_ACCESS_KEY=<random 24+ char secret>
TOKEN_ENCRYPTION_KEY=<32 random bytes as base64>
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

Register `${PUBLIC_API_URL}/api/google/callback` in your Google OAuth client.

## Browser worker

```sh
pnpm --dir apps/worker exec playwright install chromium
pnpm dev:browser
```

Set:

```env
BROWSER_WORKER_URL=http://127.0.0.1:8790
WORKER_TOKEN=<random 32+ char secret>
```

## Optional computer workspace

```sh
docker build -t opensource-muse-computer:local apps/computer
COMPUTER_ENABLED=true pnpm dev
```

Commands run in a nonroot container with a persistent `/workspace` volume. Keep this boundary boring and explicit.

## Project map

| Path | Purpose |
| --- | --- |
| `apps/mobile` | Expo / React Native / Web client, including the Studio tab. |
| `apps/server` | Hono API, runtime boundary, task engine, auth, files, persistence. |
| `apps/worker` | Playwright browser worker with persistent profiles. |
| `apps/computer` | Optional Linux workspace image and filesystem helper. |
| `packages/domain` | Shared types and validation. |
| `packages/integrations` | Google, PDF, vault, and adapter code. |
| `packages/backends` | Optional backend adapter experiments. |
| `tests` | Workflow, persistence, provider, and authorization tests. |

## Development

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build:server
pnpm build:web
```

## Attribution

OpenSource Muse started from the MIT-licensed OpenMuse codebase and is being reshaped into a separate public project with its own identity, Studio workflow, launch direction, and community roadmap.

## License

MIT. Build with it, fork it, ship your own version, and keep the agent stack inspectable.
