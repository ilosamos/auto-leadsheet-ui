---
title: Agent Notes
---

# Auto Leadsheet UI

Brief overview: Next.js app for leadsheet.me that lets users upload audio
and generate leadsheets, with NextAuth-based auth and a generated API client.

## Directory Structure

- `app/` Next.js App Router pages, API routes, and metadata.
- `app/client/` Generated API client (do not hand-edit).
- `components/` Shared UI components.
- `providers/` React context providers (auth, jobs).
- `hooks/` Custom React hooks.
- `utils/` Small utilities and constants.
- `types/` Shared TS types.
- `public/` Static assets.

## Quick Commands

- `yarn dev` Run the local dev server.
- `yarn build` Build for production.
- `yarn lint` Run ESLint.

## Environment

See `README.md` for required `.env.local` keys (not checked in).
