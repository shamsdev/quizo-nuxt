# Quizo! — Quiz Game (Nuxt Client)

Web client for **Quizo**, a real-time multiplayer quiz game. Built with Nuxt 3, Vue 3, and Vuetify. RTL (Persian) UI, PWA support, and sound effects.

## Tech stack

- **Nuxt 3** — Vue 3, Vite
- **Vuetify 3** — UI components
- **@karizma-studio/karizma-connection-js** — Real-time connection to the backend
- **@vite-pwa/nuxt** — PWA (install prompt, offline support)
- **Lucide Vue** — Icons

## Prerequisites

- **Node.js** 18+ (or 20+)
- **npm**, **pnpm**, **yarn**, or **bun**

## Setup

```bash
# Install dependencies
npm install
# or: pnpm install | yarn install | bun install
```

## Environment

Create a `.env` (or set in the environment) to point at the backend:

```env
SERVER_ENDPOINT=https://your-backend-url/Hub
```

For local development, use the URL of your running QuizoDotnet API (e.g. `http://localhost:5005/Hub` or `https://localhost:7016/Hub`).

## Development

Start the dev server (default port **3001**):

```bash
npm run dev
# or: pnpm dev | yarn dev | bun run dev
```

Open [http://localhost:3001](http://localhost:3001).

## Build & preview

```bash
# Production build
npm run build

# Preview production build locally
npm run preview
```

## Project docs

- **[Avatar images](docs/AVATARS.md)** — Adding or regenerating avatar assets (optimized PNG + WebP, no duplication in git).

## Repository layout

- `components/` — Vue components (dialogs, gameplay, buttons, etc.)
- `pages/` — Nuxt pages (home, gameplay)
- `composables/` — useGameSounds, useAvatarUrl, useDialogManager, etc.
- `assets/styles/` — Design tokens, fonts, confetti
- `public/images/avatars/` — Optimized avatar images

## License

Private / as per your project license.
