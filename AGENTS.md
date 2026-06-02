# AGENTS.md

Guidance for AI agents (Claude Code, Cursor, etc.) working in this repository.

## Project

Single-page app: **Vite 8 + React 19 + TypeScript**, package manager **pnpm**. Styling is
**Tailwind CSS v4** (CSS-first config, no `tailwind.config.js`). The app entry is
`src/main.tsx` → `src/app.tsx`, which wraps the page tree in `PopupsProvider` around
`MainPage`.

This is a lean starter: several path aliases (`@api`, `@models`, `@router`) point to
directories that don't exist yet — create them as features land.

## Commands

```bash
pnpm dev          # vite dev server (HTTPS via basic-ssl, --host)
pnpm build        # tsc (typecheck) && vite build  → dist/
pnpm preview      # serve the production build
pnpm generate     # plop: scaffold a new component/page (see "Code generation")
pnpm lint:check   # eslint, no fixes (use this to verify)
pnpm lint         # eslint --fix
pnpm prettier     # prettier --write src
```

- **No test framework is configured** — there are no tests to run.
- A **husky pre-commit hook** runs `lint-staged` → `eslint --fix` + `prettier` on staged
  `*.{js,jsx,ts,tsx}`. Commits with lint errors are blocked.
- Browser target is **modern only** (Chrome 111+/Safari 16.4+). The `@vitejs/plugin-legacy`
  was intentionally removed; Tailwind v4 relies on cascade layers, `@property`, and
  `color-mix`. Do not reintroduce IE11/old-Safari targets.

## Styling system (read this before touching any UI)

The core idea: **author every size in `rem` as if it were `px`, and the whole layout
scales fluidly with the viewport.** This is configured entirely in `src/index.css`.

1. **Fluid root font-size** (`@layer base`): `html, body { font-size: 0.052vw }` on desktop,
   `0.3125vw` below 999px. At the design widths this makes **`1rem ≈ 1px`**, so a `24rem`
   value renders ~24px at the design size and scales up/down with the window.

2. **`--spacing: 4rem`** in `@theme` rescales Tailwind's spacing scale so **1 unit = 4rem
   (≈4px at design width)** — identical px semantics to stock Tailwind, but in scalable rem:
   - `w-4` → `width: calc(var(--spacing) * 4)` = `16rem`
   - `p-10` → `40rem`, `top-6` → `24rem`, `pt-5 px-2.5` → `20rem / 10rem`
   - Use arbitrary values for non-multiples or non-spacing props:
     `rounded-[12rem]`, `h-[3.2rem]`, `h-[var(--full-height)]`, `bg-[#0d1a2a]`.

3. **Custom breakpoint** `--breakpoint-desktop: 1000px` (and **Tailwind's default
   `sm/md/lg/xl/2xl` breakpoints are cleared** via `--breakpoint-*: initial`). You get two
   variants and only these:
   - `desktop:` → `@media (min-width: 1000px)`
   - `max-desktop:` → `@media (max-width: 999.98px)` (mobile overrides)

   Keep breakpoints in **px**, never rem — `rem` in media queries is relative to the browser
   root (16px), not our `vw` root hack.

4. **Default `--text-*` scale is also cleared** (it would render ~1px under our root
   font-size). Define text sizes in `@theme` when needed (e.g. `--text-base: 13rem`).

5. **Design tokens live in `@theme`**: colors (`bg-black`, `text-white`, `bg-popup`,
   `bg-popup-mobile`) and fonts (`font-inter`, `font-rosatom`, `font-ibm-mono`,
   `font-ibm-sans`). Add new tokens here, not in component files.

There are **no styled-components** — the project was migrated off it. Style with utility
classes; use the `cn(...)` helper from `@utils` to merge/conditionally join class strings.

## Architecture & conventions

- **Path aliases + barrels.** Import via aliases defined in `tsconfig.json`
  (`@providers`, `@ui-kit`, `@stores`, `@pages`, `@hooks`, `@components`, `@tokens`,
  `@constants`, `@utils`, `@app/*`, `@images/*`). Every feature dir has an `index.ts`
  barrel that re-exports its public surface; import from the alias, not deep paths.

- **Code generation.** `pnpm generate` (plop) scaffolds `src/<folder>/<name>/` with a
  component, an optional `types.ts`, an `index.ts`, and auto-appends the export to the
  folder barrel at the `/* PLOP_INJECT_IMPORT */` marker. Preserve that marker comment.
  Generated components are plain Tailwind-styled `div`s (no styles file — style with
  utility classes).

- **Popup system** (`src/ui-kit/popup`): `Popup` renders into a portal (`PopupPortal`) and
  manages mount/unmount with a `POPUP_DELAY` (300ms) timer. `PopupLayout` does the
  overlay/container/close markup. Enter/exit animations use `react-transition-group`
  (`CSSTransition`); the classNames map lives in `popup-layout/animations.ts` and the
  matching styles in the co-located `popup-transitions.css` (imported by the component).
  If you change `POPUP_DELAY`, update the `300ms` transition durations in that CSS too.

- **State.** Client state via small Zustand stores in `src/stores` (e.g. `use-device`
  exposes `isMobile`). There is currently no server-state/data-fetching layer.

- **Breakpoint duplication.** `Breakpoints.DESKTOP` (999.9) in
  `src/tokens/breakpoints/breakpoints.ts` is read in JS (`use-device.ts`:
  `window.innerWidth < Breakpoints.DESKTOP`). CSS can't import the TS constant, so it's
  mirrored as `--breakpoint-desktop: 1000px` in `index.css`. **Change both together.**

## Where to add code

All code lives under `src/`, organised into top-level domain folders, each exposed
through an `index.ts` **barrel** and an `@alias` (see `tsconfig.json` paths). Two layout
patterns are used: **folder-per-unit** (a kebab-case folder + main file + `index.ts`) for
components/pages/providers, and **flat files** for hooks/stores/constants.

| Adding a… | Where | How to wire it |
|---|---|---|
| Shared **component** | `src/components/<name>/` | `pnpm generate` → folder `components` |
| Reusable **UI primitive** | `src/ui-kit/<name>/` | `pnpm generate` → folder `ui-kit` |
| **Page** | `src/pages/<name>/` | `pnpm generate` → folder `pages` |
| **Hook** | `src/hooks/use-<name>.ts` | add `export * from './use-<name>'` to `src/hooks/index.ts` |
| **Store** (Zustand) | `src/stores/use-<name>.ts` | add `export * from './use-<name>'` to `src/stores/index.ts` |
| **Provider** | `src/providers/<name>-provider/` (`<name>-provider.tsx` + `index.ts`) | re-export from `src/providers/index.ts` **and** mount it in `src/app.tsx` |
| **Design token** | `src/tokens/<group>/` (+ `index.ts`) | re-export from `src/tokens/index.ts` |
| **Constant** | `src/constants/<file>.ts` | export from `src/constants/index.ts` |
| **Util** | `src/utils/` | export from `src/utils/index.ts` (`@utils`) |

Naming: **kebab-case** files/folders, **PascalCase** component/provider exports,
`use-x.ts` → `useX` for hooks and stores. Always re-export from the domain's `index.ts`
and import via the alias (`@hooks`, `@stores`, …), never a deep path. Providers are the
one thing the generator can't fully wire — after creating the folder, add it to
`providers/index.ts` and compose it in `app.tsx`.

## Conventions to follow

- TypeScript is strict (`noUnusedLocals`, `noUnusedParameters`); unused vars fail the build.
- ESLint enforces `simple-import-sort` (imports must be sorted) and Prettier — run
  `pnpm lint` before committing or the hook will reformat.
- Commit messages follow Conventional Commits (`feat(...)`, `chore(deps): ...`, `fix(...)`).
