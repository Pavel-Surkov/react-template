# Quantum Career Predictor

A single-page web application built with **React 19**, **Vite 8**, and **TypeScript**,
styled with **Tailwind CSS v4** (CSS-first, no `tailwind.config.js`). Its defining feature
is a **fluid, rem-based design system**: every size is authored in `rem` as if it were
`px`, and the entire layout scales proportionally with the viewport.

> [!NOTE]
> This is the **`main`** branch (Tailwind CSS v4). A parallel **`styled-components`** branch
> implements the same app with styled-components instead — same fluid design system,
> different styling engine.

## Features

- **Fluid rem-based scaling** — design in `px`, render in scalable `rem`; one root
  font-size in `vw` makes the whole UI scale with the viewport (see [Styling](#styling-system)).
- **Tailwind v4 CSS-first config** — tokens, colors, and breakpoints declared in `@theme`.
- **Component generator** — scaffold components with a single command (`pnpm generate`).
- **Path aliases + barrels** — clean imports (`@pages`, `@ui-kit`, `@stores`, …).
- **Accessible popup system** — portal-based modals with enter/exit transitions.
- **Zustand** for lightweight client state, **react-transition-group** for animations.
- Pre-wired **ESLint + Prettier** with a husky pre-commit hook.

## Tech stack

| Area       | Package                                 |
| ---------- | --------------------------------------- |
| Framework  | React 19                                |
| Build tool | Vite 8 (HTTPS dev server via basic-ssl) |
| Language   | TypeScript (strict)                     |
| Styling    | Tailwind CSS v4 (`@tailwindcss/vite`)   |
| State      | Zustand                                 |
| Animations | react-transition-group                  |
| Tooling    | pnpm, ESLint, Prettier, husky, plop     |

## Getting started

### Prerequisites

- **Node.js** 18+
- **pnpm** (`npm i -g pnpm`)

### Install & run

```bash
pnpm install
pnpm dev        # https://localhost:5173 (self-signed cert)
```

> [!TIP]
> The dev server runs over HTTPS via `@vitejs/plugin-basic-ssl`; accept the self-signed
> certificate warning on first load.

## Scripts

| Command           | Description                                 |
| ----------------- | ------------------------------------------- |
| `pnpm dev`        | Start the Vite dev server (HTTPS, `--host`) |
| `pnpm build`      | Type-check (`tsc`) and build to `dist/`     |
| `pnpm preview`    | Serve the production build locally          |
| `pnpm generate`   | Scaffold a new component via plop           |
| `pnpm lint`       | Run ESLint with `--fix`                     |
| `pnpm lint:check` | Run ESLint without fixing (CI/verify)       |
| `pnpm prettier`   | Format `src` with Prettier                  |

> [!NOTE]
> There is no test runner configured. A husky pre-commit hook runs ESLint + Prettier on
> staged files, so commits with lint errors are blocked.

## Project structure

```
src/
├── app.tsx            # Root composition: PopupsProvider > MainPage
├── main.tsx           # Entry point
├── index.css          # Tailwind @theme + global base layer (fluid rem scaling)
├── components/        # Shared components
├── ui-kit/            # Reusable UI primitives (e.g. popup)
├── pages/             # Page-level components
├── providers/         # React context providers
├── hooks/             # Custom hooks
├── stores/            # Zustand stores
├── tokens/            # Design tokens (colors, breakpoints)
├── constants/         # App-wide constants
└── utils/             # Utilities (incl. the cn() class-merge helper)
```

Each domain folder exposes an `index.ts` barrel and a `@alias` (configured in
`tsconfig.json`). Always import from the alias, never a deep path.

| Adding a…             | Where                            | How to wire it                                              |
| --------------------- | -------------------------------- | ----------------------------------------------------------- | -------------- | --------------------------------- |
| Component / UI / page | `src/components                  | ui-kit                                                      | pages/<name>/` | `pnpm generate` → pick the folder |
| Hook                  | `src/hooks/use-<name>.ts`        | export from `src/hooks/index.ts`                            |
| Store                 | `src/stores/use-<name>.ts`       | export from `src/stores/index.ts`                           |
| Provider              | `src/providers/<name>-provider/` | export from `providers/index.ts` **and** mount in `app.tsx` |
| Design token          | `@theme` in `src/index.css`      | use the generated utility (`bg-*`, `font-*`, …)             |

## Styling system

The core idea: **author every size in `rem` as if it were `px`, and the whole layout
scales fluidly with the viewport.** Configured in `src/index.css`.

- `html` has a `vw`-based font-size (`0.052vw` desktop, `0.3125vw` below 999px), making
  **`1rem ≈ 1px`** at the design width. `body` sets a `16rem` (≈16px) base text size,
  inherited by everything — including modals in the `#popups` portal.
- **`--spacing: 4rem`** in `@theme` rescales Tailwind's spacing scale so **1 unit = 4rem
  (≈4px at design width)** — same px semantics as stock Tailwind, but in scalable rem:
  - `w-4` → `16rem`, `p-10` → `40rem`, `top-6` → `24rem`
  - arbitrary values for the rest: `rounded-[12rem]`, `h-[3.2rem]`, `bg-[#0d1a2a]`
- **Custom breakpoint** `--breakpoint-desktop: 1000px` (default `sm/md/lg/…` are cleared):
  - `desktop:` → `min-width: 1000px` · `max-desktop:` → mobile overrides

  Keep breakpoints in `px`, not `rem`. `Breakpoints.DESKTOP` in `src/tokens` mirrors this
  value for JS use (`use-device.ts`) and must stay in sync.

- Style with utility classes; merge/conditionally join them with the **`cn(...)`** helper
  from `@utils`.

## Browser support

Targets modern browsers (Chrome 111+ / Safari 16.4+). Tailwind v4 relies on cascade
layers, `@property`, and `color-mix`, so older browsers are not supported.
