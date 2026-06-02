# Quantum Career Predictor

A single-page web application built with **React 19**, **Vite 8**, and **TypeScript**,
styled with **styled-components**. Its defining feature is a **fluid, rem-based design
system**: every size is authored in `rem` as if it were `px`, and the entire layout scales
proportionally with the viewport.

> [!NOTE]
> This is the **styled-components** branch. A parallel **`main`** branch implements the same
> app with **Tailwind CSS v4** instead — same fluid design system, different styling engine.

## Features

- **Fluid rem-based scaling** — design in `px`, render in scalable `rem`; one root
  font-size in `vw` makes the whole UI scale with the viewport (see [Styling](#styling-system)).
- **Component generator** — scaffold components with a single command (`pnpm generate`).
- **Path aliases + barrels** — clean imports (`@pages`, `@ui-kit`, `@stores`, …).
- **Accessible popup system** — portal-based modals with enter/exit transitions.
- **Zustand** for lightweight client state, **react-transition-group** for animations.
- **Legacy browser support** — modern + legacy bundles emitted side by side.
- Pre-wired **ESLint + Prettier** with a husky pre-commit hook.

## Tech stack

| Area       | Package                                 |
| ---------- | --------------------------------------- |
| Framework  | React 19                                |
| Build tool | Vite 8 (HTTPS dev server via basic-ssl) |
| Language   | TypeScript (strict)                     |
| Styling    | styled-components + global CSS          |
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
├── index.css          # Global styles + the fluid rem scaling setup
├── components/        # Shared components
├── ui-kit/            # Reusable UI primitives (e.g. popup)
├── pages/             # Page-level components
├── providers/         # React context providers
├── hooks/             # Custom hooks
├── stores/            # Zustand stores
├── tokens/            # Design tokens (colors, breakpoints)
├── constants/         # App-wide constants
└── utils/             # Utilities
```

Each domain folder exposes an `index.ts` barrel and a `@alias` (configured in
`tsconfig.json`). Always import from the alias, never a deep path.

| Adding a…             | Where                            | How to wire it                                              |
| --------------------- | -------------------------------- | ----------------------------------------------------------- | -------------- | --------------------------------- |
| Component / UI / page | `src/components                  | ui-kit                                                      | pages/<name>/` | `pnpm generate` → pick the folder |
| Hook                  | `src/hooks/use-<name>.ts`        | export from `src/hooks/index.ts`                            |
| Store                 | `src/stores/use-<name>.ts`       | export from `src/stores/index.ts`                           |
| Provider              | `src/providers/<name>-provider/` | export from `providers/index.ts` **and** mount in `app.tsx` |
| Design token          | `src/tokens/<group>/`            | export from `src/tokens/index.ts`                           |

## Styling system

The core idea: **author every size in `rem` as if it were `px`, and the whole layout
scales fluidly with the viewport.**

- `html` has a `vw`-based font-size (`0.052vw` desktop, `0.3125vw` below 999px). This makes
  **`1rem ≈ 1px`** at the design width — so a styled rule of `padding: 40rem` renders ~40px
  and scales up/down as the window resizes. Write design `Npx` values as `Nrem`.
- `body` sets a base text size of `16rem` (≈16px, fluid), inherited by everything —
  including modals rendered into the `#popups` portal.
- Design tokens live in `src/tokens`: `Colors` and `Breakpoints`
  (`{ MOBILE: 320, DESKTOP: 999.9 }`). `Breakpoints.DESKTOP` is shared between
  styled-components media queries and JS (`use-device.ts`).

Components are styled with **styled-components**, typically in a co-located `*.styled.ts`
file.

## Browser support

A modern build plus a legacy bundle (IE11 / Chrome 49 / Safari 11 / iOS 11) are emitted
via `@vitejs/plugin-legacy`.
