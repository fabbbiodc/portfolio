---
applyTo: '**'
category: 'project-diary-and-session-prompt'
---

# Astro Portfolio Build Diary & Session Prompt

This document serves as both:
- A project diary for recording learning, commands, rationale, design notes, and troubleshooting discoveries as this Astro portfolio evolves
- A persistent session prompt for future work on this project, ensuring goals, context, and working approaches are always clear, even across multiple working sessions.

## Goals and Intent
- Build a personal portfolio website using [Astro](https://astro.build/)
- Each step is approached as a learning opportunity. All commands are manually run and are accompanied by deep explanations.
- Document choices, alternatives, questions, and answers thoroughly for future reference.
- **Writing:** User writes most code; AI assists and helps debug unless explicitly asked to write/build something

## Current Status (update per session)
- Project bootstrap complete
- Tailwind CSS v4 setup complete ✅
- Custom theme colors working via `@theme` in `src/styles/global.css` ✅
- Fonts configured (Archivo + IBM Plex Mono) ✅
- Navbar component created with responsive design ✅
- Navbar integrated into homepage ✅
- Next: Enhance homepage content, create additional pages (About, Projects, Contact)

## Session Guidance/Prompt
- Treat each session as part of an ongoing series; always check this file first for context and status.
- Record new diary entries for every new working session.
- Summarize what has been accomplished, what decisions were made, and any open questions or problems.
- Each 'future session' should:
  1. Review previous diary entries/decisions
  2. Continue with actionable next steps (broken down, step by step)
  3. Update this document with what happened in the session

## Working Approach & Preferences
- **Instruction Style:** Work in small, explicit step-by-step instructions. User writes the code; AI guides with clear, bite-sized steps.
- **Code Writing:** User writes most code. AI only writes code if explicitly asked.
- **Git Management:** User handles all git commits and pushes. AI will never create commits or push code.
- **Learning Focus:** Prioritize understanding over speed. Explain rationale for each step.

## Day 1: Project Initialization

### Checklist
- [x] Verify Node.js and npm installation
- [x] Create new Astro project
- [x] Install dependencies
- [x] Explore project structure

### Notes
- **Decision:** Using `npm create astro@latest` for project bootstrap
- **Reason:** Ensures latest features, aligns with Astro best practices

---

## Day 2: Tailwind Setup & Responsive Layout (Homepage + Navbar)

### Checklist
- [x] Add Tailwind CSS to Astro project
- [x] Fix Tailwind v4 CSS import syntax
- [x] Create tailwind.config.mjs with custom theme colors
- [x] Add fonts to global.css
- [x] Apply theme colors via `@theme` directive (fixed!)
- [x] Create a homepage (`src/pages/index.astro`)
- [x] Create a reusable, responsive NavBar component (in `src/components/Navbar.astro`)
- [x] Integrate Navbar into homepage
- [ ] Test/verify responsive design in browser (next session)

### Rationale & Notes
- **Styling:** Tailwind CSS enables fast iteration and enforces utility-first, responsive design
- **Responsiveness:** Using Tailwind's default breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`)
- **Max width:** Core content does not exceed 1200px; using `max-w-300` (Tailwind v4 generated class for ~1200px)
- **Fonts:** Archivo (headings), IBM Plex Mono (body + code)
- **Font import:** Google Fonts via CSS import
- **Colors:** Custom theme via `@theme` in `src/styles/global.css`:
  - `background`: #f8f8f8 (off-white)
  - `text`: #2d2d2d (anthracite)
  - `brand`: #5b21b6 (dark purple)
  - `error`: #dc2626
  - `warning`: #d97706
  - `info`: #2563eb
- **Tailwind v4 Discovery:** `tailwind.config.mjs` is NOT used in Tailwind v4. Instead, all theme config lives in CSS via `@theme { --color-*: value }` directives. The Vite plugin scans CSS files for these blocks and auto-generates utilities.
- **CSS Linter Warning:** `@theme` is a Tailwind v4 at-rule. Standard CSS linters don't recognize it and show warnings. This is normal and can be suppressed in editor settings.
- **Icon Library:** Using Heroicons v2 for the hamburger menu icon. Import path: `'heroicons/24/solid/bars-3.svg'` (size/style/icon-name format in v2).
- **Component Structure:** 
  - Navbar: Sticky positioning, responsive flex layout, desktop nav hidden on mobile (`hidden md:flex`), hamburger button visible on mobile (`flex md:hidden`)
  - Homepage: Imports and renders Navbar component, contains main content area with max-width constraint
- **DRY Principle:** Used Astro variables (`const linkClasses`) in Navbar to avoid repeating Tailwind classes across multiple nav links.

### Questions / Considerations
- ✅ Navigation links finalized: Home, About, Projects, Contact
- ✅ NavBar behavior: Sticky at top, hamburger on mobile, full links on desktop
- ✅ Icon library: Heroicons chosen for clean, minimal design aligned with Tailwind aesthetic
- ⚠️ Hamburger menu: Visual only in Phase A. Phase B (future) will add click interactivity to toggle mobile menu.

### Session Notes
- **Problem Discovered:** Custom theme colors weren't rendering even though classes were present in HTML
- **Root Cause:** Tailwind v4 completely redesigned config from JavaScript-based to CSS-based. The `tailwind.config.mjs` was being ignored.
- **Solution Implemented:** Added `@theme { --color-*: value }` block to `src/styles/global.css`. Tailwind v4 Vite plugin now auto-generates utilities from CSS variables.
- **Result:** Theme colors now work perfectly. `text-brand` renders as #5b21b6 (dark purple), `text-text` renders as #2d2d2d (anthracite), etc.
- **Icon Integration:** Initially attempted manual hamburger button with divs. Switched to Heroicons library for cleaner, more maintainable solution. Heroicons v2 uses directory-based import structure (`heroicons/[size]/[style]/[icon-name].svg`).
- **Development Preference:** User strongly prefers small, explicit step-by-step instructions. This approach ensures deep learning and active participation in code writing.
- **Cleanup Needed:** Delete `tailwind.config.mjs` (no longer used in v4, keeps repo clean)

### Completed This Session
1. Diagnosed and fixed Tailwind v4 theme color issue by moving config to CSS
2. Created responsive Navbar component with:
   - Sticky positioning at top (`sticky top-0 z-50`)
   - Desktop navigation with 4 links (Home, About, Projects, Contact)
   - Mobile hamburger menu icon (Heroicons)
   - Responsive classes: `hidden md:flex` and `flex md:hidden`
   - Theme colors applied throughout
3. Integrated Navbar into homepage
4. Installed and integrated Heroicons library for icons
5. Updated working preferences in this document

---

_Keep adding new dated sections below for each future session, with specific notes, steps carried out, and any questions or insights._
