# AGENTS.md

Guidance for AI agents (Claude Code, Cursor, etc.) working in this repository.

## Project

Single-page app: **Vite 8 + React 19 + TypeScript**, package manager **pnpm**. Styling is
**styled-components**. Entry is `src/main.tsx` → `src/app.tsx`, which wraps the page tree
in `PopupsProvider` around `MainPage`.

This is a lean starter: several path aliases (`@api`, `@models`, `@router`) point to
directories that don't exist yet — create them as features land.

## Commands

```bash
pnpm dev          # vite dev server (HTTPS via basic-ssl, --host)
pnpm build        # tsc (typecheck) && vite build  → dist/
pnpm preview      # serve the production build
pnpm generate     # plop: scaffold a new component (see "Code generation")
pnpm lint:check   # eslint, no fixes (use this to verify)
pnpm lint         # eslint --fix
pnpm prettier     # prettier --write src
```

- **No test framework is configured** — there are no tests to run.
- A **husky pre-commit hook** runs `lint-staged` → `eslint --fix` + `prettier` on staged
  `*.{js,jsx,ts,tsx}`. Commits with lint errors are blocked.
- `@vitejs/plugin-legacy` emits a legacy bundle for old browsers (IE11 / Chrome 49 /
  Safari 11 / iOS 11) alongside the modern build.

## Styling system (read this before touching any UI)

The core idea: **author every size in `rem` as if it were `px`, and the whole layout
scales fluidly with the viewport.** Set up in `src/index.css`:

- `html, body { font-size: 0.052vw }` on desktop, `0.3125vw` below 999px. At the design
  widths this makes **`1rem ≈ 1px`**, so a styled rule of `padding: 40rem` renders ~40px
  at the design size and scales up/down with the window. **Write design `Npx` as `Nrem`**
  in styled-components.
- Global CSS vars in `:root`: `--full-height` (mobile-vh-safe height), `--min-height`,
  and the `--font-*` families (Inter, Rosatom, IBMPlexMono, IBMPlexSans).

Components are styled with **styled-components** (`styled.div\`…\``), typically in a
co-located `*.styled.ts` file. Design tokens live in `src/tokens`:
- `Colors` (`@tokens`) — color constants used inside styled blocks.
- `Breakpoints` — `{ MOBILE: 320, DESKTOP: 999.9 }`. Used both in styled-components media
  queries (`@media (max-width: ${Breakpoints.DESKTOP}px)`) **and** in JS
  (`src/stores/use-device.ts`: `window.innerWidth < Breakpoints.DESKTOP`).

## Architecture & conventions

- **Path aliases + barrels.** Import via the aliases in `tsconfig.json` (`@providers`,
  `@ui-kit`, `@stores`, `@pages`, `@hooks`, `@components`, `@tokens`, `@constants`,
  `@utils`, `@app/*`, `@images/*`). Every feature dir has an `index.ts` barrel that
  re-exports its public surface; import from the alias, not deep paths.

- **Code generation.** `pnpm generate` (plop) scaffolds `src/<folder>/<name>/` with a
  component, optional `*.styled.ts` and `types.ts`, an `index.ts`, and auto-appends the
  export to the folder barrel at the `/* PLOP_INJECT_IMPORT */` marker. Preserve that
  marker comment.

- **Popup system** (`src/ui-kit/popup`): `Popup` renders into a portal (`PopupPortal`) and
  manages mount/unmount with a `POPUP_DELAY` (300ms) timer. `PopupLayout` does the
  overlay/container/close markup; its styled-components live in
  `popup-layout/styled-components/`, with enter/exit animations driven by
  `react-transition-group` (`CSSTransition`) and a `transitionMixin` helper. Keep the
  `classNames` maps in sync with the nested `&.enter/&.exit` selectors.

- **State.** Client state via small Zustand stores in `src/stores` (e.g. `use-device`
  exposes `isMobile`). There is currently no server-state/data-fetching layer.

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
| **Util** | `src/utils/` | export from `src/utils/index.ts` |

Naming: **kebab-case** files/folders, **PascalCase** component/provider exports,
`use-x.ts` → `useX` for hooks and stores. Always re-export from the domain's `index.ts`
and import via the alias (`@hooks`, `@stores`, …), never a deep path. Providers are the
one thing the generator can't fully wire — after creating the folder, add it to
`providers/index.ts` and compose it in `app.tsx`.

## Conventions to follow

- TypeScript is strict (`noUnusedLocals`, `noUnusedParameters`); unused vars fail the build.
- ESLint enforces `simple-import-sort` (imports must be sorted) and Prettier — run
  `pnpm lint` before committing or the hook will reformat.
- Commit messages follow Conventional Commits (`feat(...)`, `chore(...)`, `fix(...)`).
