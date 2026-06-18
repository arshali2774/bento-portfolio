# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Commands

```bash
bun dev        # Start dev server (Next.js on http://localhost:3000)
bun build      # Production build
bun start      # Run production server
bun lint       # ESLint via next lint
```

## Architecture

Single-page Next.js 16 portfolio (App Router). One route: `app/page.tsx`.

Key directories:
- `app/` — layout, global CSS, single page
- `components/` — `hero.tsx`, `bento-grid.tsx`, `contact-card.tsx`, `wipe-overlay.tsx`
- `components/ui/` — shadcn primitives (button, sonner, theme-cycler)
- `components/animate-ui/` — animated icon wrappers
- `lib/` — `themes.ts`, `theme-script.ts`, `gsap.ts`, `utils.ts`

## Key Patterns & Gotchas

**Animated layout mode**: Full animation (Hero + BentoGrid explosion) only activates at `min-width: 1280px AND min-height: 720px`. Below that, only the static BentoGrid renders.

**GSAP imports**: Always import from `@/lib/gsap` (not directly from `gsap`). The singleton registers `CustomEase` and `SplitText` plugins and creates the `"hop"` easing — importing gsap directly silently breaks these.

**Theme system**: `lib/themes.ts` defines 7 themes with CSS vars `--theme-bg`, `--theme-card`, `--theme-text`. `lib/theme-script.ts` generates a blocking inline `<script>` injected in `<head>` to apply the next theme before first paint (no flash). State persists in `localStorage` under key `"portfolio-theme-state"`.

**Fonts**: Six Google Fonts loaded as CSS variables — `--font-instrument-serif`, `--font-outfit`, `--font-inter`, `--font-source-code-pro`, `--font-limelight`, `--font-manufacturing-consent`.

## Agent skills

### Issue tracker

Issues live in GitHub Issues on `arshali2774/bento-portfolio`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default label vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
