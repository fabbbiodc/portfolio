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
- Project bootstrap complete ✅
- Tailwind CSS v4 setup complete ✅
- Custom theme colors working via `@theme` in `src/styles/global.css` ✅
- Fonts configured (Archivo + IBM Plex Mono) ✅
- Navbar component created with responsive design ✅
- Navbar integrated into homepage ✅
- Logo link to homepage working ✅
- Mobile navigation dropdown complete with smooth animations ✅
- Dark/light theme toggle system complete ✅
  - Centralized tokens (light/dark color definitions) ✅
  - Theme persistence (localStorage + system preference) ✅
  - Smooth color transitions ✅
  - Reusable ThemeToggle component ✅
  - Pure utility functions in `src/utils/theme.ts` ✅
- Hamburger menu logic extracted to `src/utils/menu.ts` ✅
- Content Collections configured (`programming` + `design` collections) ✅
- Layout component created (`src/layouts/Layout.astro`) ✅
- All pages created (Home, About, Projects, Contact) ✅
- Transparent navbar ✅
- Mobile menu border fixed (no line when closed) ✅
- Next: Enhance homepage content and add real project content

## Session Guidance/Prompt
- Treat each session as part of an ongoing series; always check this file first for context and status.
- Record new diary entries for every new working session.
- Summarize what has been accomplished, what decisions were made, and any open questions or problems.
- Each 'future session' should:
  1. Review previous diary entries/decisions
  2. Continue with actionable next steps (broken down, step by step)
  3. Update this document with what happened in the session

## Working Approach & Preferences
- **Instruction Style:** Work in step-by-step instructions with slightly longer, more cohesive steps (vs. ultra-granular). User writes the code; AI guides with clear explanations.
- **Code Writing:** User writes most code. AI only writes code if explicitly asked.
- **Git Management:** User handles all git commits and pushes. AI will never create commits or push code.
- **Learning Focus:** Prioritize understanding over speed. Explain rationale for each step.
- **Reference Material:** See `NOTES.md` in the root directory for comprehensive reference on all technologies, techniques, and syntax used. When new concepts/technologies are introduced, they are documented in `NOTES.md` for future reference.

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
- ✅ Hamburger menu: Interactive with smooth dropdown animation (Phase B complete)
- ✅ Logo acts as homepage link with hover effect

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

## Day 3: Mobile Navigation Interactivity (Hamburger Toggle + Dropdown Menu)

### Checklist
- [x] Make logo a clickable link to homepage with hover styling
- [x] Add client-side JavaScript to Navbar component
- [x] Implement hamburger button icon toggle (☰ ↔ ✕)
- [x] Create mobile dropdown menu HTML structure
- [x] Implement smooth max-height animation for menu open/close
- [x] Add click handlers to menu links to close on navigation
- [x] Add click-outside handler to close menu when clicking elsewhere
- [x] Fix layout shift by positioning menu as overlay

### Rationale & Notes
- **Logo as Link:** Best UX practice - logo always navigates to homepage. Used `<a>` tag with href="/" and applied link styling.
- **Client-Side JavaScript:** Astro uses `<script>` tags for client-side interactivity (runs in browser). Scripts are automatically scoped to the component and executed client-side.
- **Icon Toggle:** Hamburgers use two icons (bars and X) that swap based on `isOpen` state. Toggling `hidden` class shows/hides each icon.
- **Mobile Menu Positioning:** Used `absolute` positioning within `relative` nav parent so menu overlays content instead of pushing it down (prevents layout shift). Menu is a child of `<nav>` for proper positioning context.
- **Smooth Animation:** Used CSS `transition-all duration-300` with JavaScript `maxHeight` manipulation:
  - Closed: `maxHeight = '0'` with `overflow: hidden`
  - Open: `maxHeight = element.scrollHeight + 'px'` (auto-sizes to content)
  - Transition creates smooth expand/collapse effect over 300ms
- **Event Handlers:**
  - Click hamburger → `toggleMenu()` (flips `isOpen` state)
  - Click menu link → `closeMenu()` (sets `isOpen = false`)
  - Click outside → `closeMenu()` if menu is open (using `element.contains()` checks)
- **TypeScript Considerations:**
  - `document.getElementById()` returns `HTMLElement | null`, so we use `as HTMLElement` type assertion
  - `event.target` is `EventTarget | null`, so we cast to `Node` with `as Node` for `.contains()` method
  - Optional chaining (`?.`) is used for safety when accessing potentially null elements

### Session Notes
- **Problem 1:** `client:load` directive didn't work on `<nav>` - Astro directives only work on framework components, not standard HTML elements
- **Solution 1:** Used Astro's `<script>` tag instead - automatically runs client-side without needing `client:load`
- **Problem 2:** Menu appeared inside navbar but didn't animate on toggle
- **Root Cause:** Click listener was being attached inside `toggleMenu()` function instead of globally
- **Solution 2:** Moved event listener attachment outside the function to the bottom of script (runs once on page load)
- **Problem 3:** Layout shifted when menu opened (content pushed down)
- **Root Cause:** Menu was in normal document flow; when it expanded, it pushed content below
- **Solution 3:** Used `absolute` positioning with `top-full left-0 right-0` to overlay menu on top of content. Menu must be **child** of nav (not sibling) for positioning to work correctly relative to nav
- **Problem 4:** Clicking links didn't close menu
- **Solution 4:** Added event listeners to all links using `querySelectorAll()` to find all `<a>` elements, then `forEach` to attach click handler to each

### Completed This Session
1. Made logo clickable homepage link with hover transition
2. Implemented hamburger button interactivity:
   - Click toggles icon between ☰ and ✕
   - Icon changes are instant, menu animation is smooth
3. Created mobile dropdown menu with all 4 navigation links
4. Implemented smooth animation using `maxHeight` transition technique
5. Added three interaction handlers:
   - Hamburger click → toggle menu open/close
   - Menu link click → close menu and navigate
   - Outside click → close menu if open
6. Fixed layout shift by using overlay positioning
7. Debugged TypeScript errors with proper type assertions

---

## Day 4: Dark/Light Theme Toggle & Centralized Design Tokens (✅ Complete)

### Objectives
- Implement dark and light theme system ✅
- Centralize color tokens and design values ✅
- Add theme toggle button to Navbar ✅
- Persist theme preference in browser (localStorage) ✅
- Support system preference detection (prefers-color-scheme) ✅
- Separate JavaScript into reusable utility modules ✅

### Architecture Plan
- **Centralized Tokens:** Create `src/styles/tokens.css` with all color definitions for both light and dark themes ✅
- **Theme Switching:** Use CSS custom properties (variables) and `data-theme` attribute on `<html>` element ✅
- **Utility Functions:** Extract theme logic to `src/utils/theme.ts` for reusability and testability ✅
- **Component:** Create reusable `ThemeToggle.astro` component that can be imported multiple times ✅
- **Local Storage:** Save user's theme preference to browser storage so it persists across sessions ✅
- **System Preference:** Detect user's OS theme preference and use as default if no preference is set ✅
- **UI Toggle:** Add theme toggle button to Navbar (sun/moon icon using Heroicons) - desktop and mobile ✅

### Implementation Phases
1. **Phase A (✅ Complete):** Create centralized token system with light/dark color definitions
2. **Phase B (✅ Complete):** Add theme toggle button to Navbar UI (desktop + mobile with spacing)
3. **Phase C (✅ Complete):** Implement JavaScript logic for theme switching and persistence
4. **Phase D (✅ Complete):** Extract JavaScript to pure utility functions and reusable components
5. **Phase E (✅ Complete):** Test across components and pages

### Checklist
- [x] Create `src/styles/tokens.css` with light and dark theme tokens
- [x] Update `src/styles/global.css` to import tokens and keep `@theme` block
- [x] Add theme toggle button to Navbar component (sun/moon icons)
- [x] Position toggle on desktop (rightmost in navbar)
- [x] Position toggle on mobile (bottom of dropdown menu with spacing)
- [x] Implement theme switching logic (light ↔ dark)
- [x] Add localStorage persistence for theme preference
- [x] Add system preference detection (prefers-color-scheme)
- [x] Add smooth color transitions (0.3s ease)
- [x] Create `ThemeToggle.astro` reusable component
- [x] Extract logic to `src/utils/theme.ts` with pure functions
- [x] Test theme persistence and system preference fallback
- [x] Build verification - no errors

### Rationale & Notes
- **Dual-Config Approach:** Tailwind v4 requires `@theme` block to generate utility classes. Solution: Keep `@theme` in global.css for Tailwind's build-time class generation, use tokens.css for runtime theme switching via CSS variables.
- **CSS Variables Architecture:**
  - `:root[data-theme="light"]` and `:root:not([data-theme])` - Light theme (default)
  - `:root[data-theme="dark"]` - Dark theme
  - All color variables defined in both selectors (`--color-background`, `--color-text`, `--color-brand`, etc.)
  - Switching themes = changing `data-theme` attribute on `<html>` element
- **Light Theme Colors:** #f8f8f8 background, #2d2d2d text, #5b21b6 brand
- **Dark Theme Colors:** #1a1a1a background, #f0f0f0 text, #a78bfa brand (lighter, more visible on dark)
- **Icon Pattern:** Theme toggle uses same icon-toggle pattern as hamburger menu (sun visible/moon hidden in light, vice versa in dark)
- **Component Reusability:** `ThemeToggle.astro` imported twice (desktop + mobile) uses the same utility functions, no code duplication
- **Pure Functions:** All theme logic in `src/utils/theme.ts` uses pure functions for testability and reusability

### Session Notes - Phase A
- **Problem:** Created tokens.css with CSS variables but colors disappeared (everything black)
- **Root Cause:** Tailwind v4 scans CSS files for `@theme` blocks to auto-generate utility classes. Without `@theme`, classes like `text-brand` don't exist, so Tailwind has no utilities to apply.
- **Solution:** Keep `@theme` block in global.css for Tailwind's class generation + use tokens.css for dynamic variable overrides. Both files work in tandem.
- **Learning:** Tailwind v4's dual-config system: `@theme` for static utilities, CSS variables for dynamic theming.

### Session Notes - Phase D (Refactoring to Pure Functions)
- **Problem:** Initial implementation had `currentTheme` variable scoped to component, functions relied on global state, made testing/reuse difficult
- **Solution:** Refactored to pure functions:
  - `getSystemTheme()` - Returns system preference (pure)
  - `initializeTheme()` - Gets saved or system theme (pure)
  - `toggleTheme(currentTheme)` - Takes current theme, returns new theme (pure)
  - `setTheme(theme)` - Sets HTML attribute + localStorage (side effect, explicit)
  - `updateThemeUI(theme)` - Updates icon visibility (side effect, explicit)
- **Benefit:** Functions are predictable, testable, and reusable across components
- **Pattern:** All functions receive data as parameters, compute/perform operations, return results. No hidden dependencies on global state.

### Design Decisions
- **CSS Variables + @theme Hybrid:** Using both approaches elegantly separates concerns:
  - `@theme` (build-time) - Tells Tailwind what utilities to generate
  - `tokens.css` (runtime) - Provides variable values that change based on theme
  - Color utilities (e.g., `text-brand`) always exist, but their values change when theme switches
- **Token Centralization:** Single source of truth for all design values prevents color inconsistencies and makes maintenance easier
- **localStorage + System Preference:** User choice takes precedence, but system preference is fallback, providing good UX
- **Pure Functions in Utils:** Enables testing, reuse, and easier composition for future features
- **Reusable Component:** `ThemeToggle.astro` can be used anywhere (desktop, mobile, future pages, sidebars, etc.)

### Completed This Session
1. ✅ Implemented complete dark/light theme system with CSS variables and Tailwind integration
2. ✅ Created responsive theme toggle UI:
   - Desktop: Positioned on rightmost side of navbar
   - Mobile: At bottom of dropdown menu with spacing divider
3. ✅ Implemented theme switching with:
   - localStorage persistence
   - System preference detection (prefers-color-scheme)
   - Smooth 0.3s color transitions
4. ✅ Refactored JavaScript to pure utility functions in `src/utils/theme.ts`
5. ✅ Created reusable `ThemeToggle.astro` component (imported twice, no duplication)
6. ✅ Build passes with no errors
7. ✅ All tests passing (theme switching, persistence, icon toggle, system preference fallback)

---

## Day 5: Extract Hamburger Menu Logic to Utils (✅ Complete)

### Objectives
- Extract hamburger menu JavaScript from Navbar.astro to utility module
- Follow the same pure functions pattern as theme.ts
- Make menu logic reusable and testable

### Architecture Plan
- **Utility Module:** Create `src/utils/menu.ts` with pure functions
- **Refactor:** Update Navbar.astro to import and use utility functions
- **Pattern Match:** Same structure as theme.ts (pure + side-effect functions)

### Checklist
- [x] Create `src/utils/menu.ts` with menu utility functions
- [x] Implement pure functions: `toggleMenuState`, `calculateMaxHeight`
- [x] Implement side-effect functions: `updateMenuUI`, `setMenuMaxHeight`, `closeMenuUI`, `toggleMenuUI`
- [x] Implement setup function: `setupMenuListeners` (attaches all event handlers)
- [x] Refactor Navbar.astro to import and use menu utilities
- [x] Test hamburger functionality (toggle, close on click, close on outside)
- [x] Build verification - no errors

### Function Reference

**Pure Functions (no side effects):**
- `toggleMenuState(isOpen: boolean): boolean` - Flips boolean state
- `calculateMaxHeight(isOpen: boolean, element: HTMLElement): string` - Returns "0" or scrollHeight

**Side-Effect Functions (DOM manipulation):**
- `updateMenuUI(barsIcon, xIcon, isOpen)` - Toggles icon visibility
- `setMenuMaxHeight(menu, maxHeight)` - Sets CSS max-height for animation
- `closeMenuUI(menu, barsIcon, xIcon)` - Convenience: closes menu in one call
- `toggleMenuUI(menu, barsIcon, xIcon, isOpen)` - Convenience: toggles in one call
- `setupMenuListeners(hamburgerBtn, mobileMenu, barsIcon, xIcon)` - Attaches all event listeners

### Rationale & Notes
- **Why this pattern:** Same as theme.ts - separates pure computation from side effects
- **Pure functions** can be tested in isolation without DOM
- **Side-effect functions** are explicit about what they modify
- **Setup function** is the "glue" that connects elements to handlers
- **Pattern benefit:** Menu logic is now reusable if we add similar navigation elsewhere

### Session Notes
- **Problem:** Initial thought was to pass state as parameter to all functions (like theme)
- **Solution:** Menu needs internal state for toggle, so `isOpen` is maintained in `setupMenuListeners`
- **Key difference from theme.ts:** Theme passes state through; menu maintains internal state
- **Still valid pattern:** Pure functions (`toggleMenuState`, `calculateMaxHeight`) are testable

### Completed This Session
1. ✅ Created `src/utils/menu.ts` with all menu utility functions
2. ✅ Refactored Navbar.astro to import and use menu utilities
3. ✅ All hamburger functionality works (toggle, link clicks, outside clicks)
4. ✅ Build passes with no errors

---

## Day 6: Content Collections Setup (✅ Complete)

### Objectives
- Set up Content Collections for project case studies
- Fix "Content config not loaded" warning
- Organize projects into two collections (programming + design)

### Folder Structure
```
src/content/
├── config.ts          (defines collections)
├── programming/        (collection 1)
│   └── program-01.md  (project file)
└── design/            (collection 2)
    └── design-01.md   (project file)
```

### Checklist
- [x] Create `src/content/config.ts` with collection definitions
- [x] Define `programming` collection (type: 'content')
- [x] Define `design` collection (type: 'content')
- [x] Verify warning is fixed
- [x] Build verification - no errors

### Implementation

**File: `src/content/config.ts`**
```typescript
import { defineCollection } from 'astro:content';

export const collections = {
  programming: defineCollection({ type: 'content' }),
  design: defineCollection({ type: 'content' }),
};
```

### Rationale & Notes
- **Minimal config:** Using simple `type: 'content'` without schema for now
- **Why minimal:** Zod was deprecated in newer Astro versions; full schema can be added later
- **Schema available later:** When ready, can add fields like title, description, techStack, etc.
- **Collection usage:** Later pages will use `getCollection('programming')` and `getCollection('design')`

### Session Notes
- **Problem:** Initial attempt used incorrect Astro API syntax (plain object, not `defineCollection`)
- **Problem:** `z` from astro:content is deprecated in Astro 6.x
- **Solution:** Use minimal config without schema - enough to fix warning and enable collections

### Completed This Session
1. ✅ Created `src/content.config.ts` with minimal collection definitions
2. ✅ Fixed "Content config not loaded" warning
3. ✅ Both collections (programming + design) now available
4. ✅ Build passes with no errors

---

## Day 7: Layout Component & Page Creation (✅ Complete)

### Objectives
- Create reusable Layout component to avoid code duplication
- Create placeholder pages for About, Projects, Contact
- Refactor homepage to use Layout

### Folder Structure
```
src/
├── layouts/
│   └── Layout.astro        (new - shared layout)
├── pages/
│   ├── index.astro         (refactored to use Layout)
│   ├── about.astro         (new)
│   ├── projects.astro      (new - uses getCollection)
│   └── contact.astro       (new)
└── content.config.ts       (updated to root level for Astro 6.x)
```

### Checklist
- [x] Create `src/layouts/Layout.astro` with title prop and slot
- [x] Import Layout in homepage and refactor
- [x] Create about.astro page
- [x] Create projects.astro with getCollection()
- [x] Create contact.astro page
- [x] Verify all routes work (/, /about, /projects, /contact)
- [x] Build verification - no errors

### Implementation Details

**Layout Component (`src/layouts/Layout.astro`):**
- Accepts `title` prop for page-specific title
- Imports global CSS (includes Tailwind)
- Includes Navbar on every page
- Uses `<slot />` for page-specific content
- Keeps all HTML structure (doctype, head, body) in one place

**Homepage (`src/pages/index.astro`):**
- Refactored to use Layout component
- Removed duplicate HTML structure
- Only contains page-specific content

**Projects Page (`src/pages/projects.astro`):**
- Uses `getCollection('programming')` and `getCollection('design')`
- Groups projects by category
- Shows "No projects yet" if collection is empty
- Displays project id (filename) as placeholder

### Rationale & Notes
- **Layout pattern:** Eliminates code duplication - Navbar, global CSS, HTML structure all in one place
- **getCollection:** Astro 6.x uses `getCollection('collection-name')` to fetch content
- **project.id:** In Astro content collections, the id is typically the filename (without extension)
- **Slot mechanism:** Astro's `<slot />` is a placeholder where page content gets injected

### Session Notes
- **Problem 1:** LegacyContentConfigError - config was in wrong location
- **Solution:** Moved from `src/content/config.ts` to `src/content.config.ts` (root)
- **Problem 2:** Loader type error in config
- **Solution:** Used `glob` from `astro/loaders` with correct syntax (not wrapped in object with 'type')
- **Key learning:** Astro 6.x changed content collections API significantly

### Completed This Session
1. ✅ Created `src/layouts/Layout.astro` with title prop and slot
2. ✅ Refactored `src/pages/index.astro` to use Layout
3. ✅ Created `src/pages/about.astro` placeholder page
4. ✅ Created `src/pages/projects.astro` with content collections
5. ✅ Created `src/pages/contact.astro` placeholder page
6. ✅ Fixed content.config.ts for Astro 6.x (moved to root, correct loader syntax)
7. ✅ All routes work correctly
8. ✅ Build passes with no errors

---

## Day 8: Navbar UI Enhancements (✅ Complete)

### Objectives
- Make navbar transparent (no background color)
- Fix mobile menu border visibility issue

### Changes Made

**1. Transparent Navbar:**
- Removed `bg-background` class from `<nav>` element in `Navbar.astro`
- Navbar is now transparent by default
- Layout's body now has `bg-background` for full-page theme background

**2. Mobile Menu Border Fix:**
- Problem: Border rendered even when menu was closed (collapsed to max-height: 0)
- Solution: Moved border from outer container to inner wrapper
- Outer div handles animation (`max-h-0`, `overflow-hidden`)
- Inner div has the border and background (`border border-text bg-background`)
- Border only visible when menu opens and has content height

### Implementation Details

**Navbar.astro changes:**
```astro
<!-- Before -->
<nav class="relative top-0 z-50 bg-background">

<!-- After -->
<nav class="relative top-0 z-50">
```

**Mobile menu structure:**
```astro
<!-- Outer - handles animation -->
<div id="mobile-menu" class="... max-h-0 overflow-hidden ...">
  <!-- Inner - has border and background -->
  <div class="border border-text bg-background">
    <!-- menu content -->
  </div>
</div>
```

### Rationale & Notes
- **Transparency:** Clean look, page content visible behind navbar
- **Border fix:** Moving border to inner element ensures it's clipped by outer div's `overflow-hidden` when collapsed
- **Both themes:** Works in both light and dark themes since it uses `border-text` color token

### Completed This Session
1. ✅ Made navbar transparent (removed background class)
2. ✅ Applied theme background to Layout's body (`bg-background`)
3. ✅ Fixed mobile menu border - only visible when open
4. ✅ Verified both themes work correctly
5. ✅ Build passes with no errors

---

## Day 9: Terminal-Style Hero Navigation Component (✅ Complete)

### Objectives
- Create a terminal-aesthetic hero section for homepage
- Implement keyboard navigation (arrow keys + Enter)
- Add scroll-based auto-highlighting of navigation links
- Support touch/click interaction on mobile

### Phases
1. **Phase 1 (✅ Complete):** Component structure and styling
2. **Phase 2 (✅ Complete):** Keyboard navigation (arrow keys + Enter)
3. **Phase 2.5a (✅ Complete):** HeroPreview component with descriptions
4. **Phase 2.5b (✅ Complete):** HeroSection wrapper component
5. **Phase 2.5c (✅ Complete):** Add > prefix to selected links
6. **Phase 2.5d (✅ Complete):** Sync Hero and Preview
7. **Phase 2.5e (✅ Complete):** Update index.astro to use HeroSection

### Completed This Session
1. ✅ Created `src/components/Hero.astro` with terminal aesthetic
2. ✅ Implemented keyboard navigation (arrow keys + Enter)
3. ✅ Created `src/components/HeroPreview.astro` with descriptions
4. ✅ Created `src/components/HeroSection.astro` wrapper
5. ✅ Added > prefix and sync logic between components
6. ✅ Updated `src/pages/index.astro` to use HeroSection

---

## Day 10: Hero Component Enhancements & Hover-as-Selection (✅ Complete)

### Objectives
- Fix spacing initialization issue with CSS solution
- Implement hover-as-selection with preview sync (Option A)
- Fix TypeScript/linting errors
- Document solutions in BUILD_DIARY and NOTES

### Session Flow & Key Discoveries

**Problem 1: Spacing Not Appearing on Page Load**
- **Issue:** Links showed `about`, `projects`, `contact` without spacing on initial load
- **Root Cause:** HTML collapses consecutive whitespace by default
- **Solution:** Added `white-space: pre` to `.hero-link` CSS class
- **Result:** Spaces now preserved perfectly on page load and after interactions
- **Key Learning:** CSS `white-space: pre` is the cleanest solution for monospace spacing preservation

**Problem 2: Hover Styling Typo**
- **Issue:** Hover state showed opacity change but not inverse highlight colors
- **Root Cause:** Line 36 had typo: `background-color: : var(--color-text)` (double colon)
- **Solution:** Fixed typo to: `background-color: var(--color-text)`
- **Result:** Hover now shows full inverse highlight + `> ` prefix

**Problem 3: TypeScript/Linting Errors (12 errors)**
- **Issues Found:**
  - Line 3: Unused import `updatePreview` (imported but never used)
  - Line 85: Loose equality `==` instead of `===`
  - HeroPreview.astro line 24: Function parameter `sectionKey` not typed
  - HeroPreview.astro line 24-32: Unused `updatePreview` export (duplicated in script)
- **Solutions Applied:**
  - Removed unused import from Hero.astro line 3
  - Changed `==` to `===` on line 85
  - Added type annotation: `sectionKey: string` in HeroPreview.astro
  - Removed redundant `updatePreview` function from HeroPreview.astro frontmatter
- **Status:** Build passes with no errors; some IDE warnings remain (non-blocking)

### Architecture: Hover-as-Selection (Option A)

**Implemented Features:**
1. **Hover State Management:**
   - Separate `hoveredIndex` variable from `currentIndex`
   - Hover shows full selection styling without changing actual selection
   - Moving mouse away reverts to current selection state

2. **Functions Created:**
   - `updateHoverUI(newHoverIndex)` - Shows hover styling + updates preview
   - `clearHover()` - Reverts to current selection, restores preview
   - Event listeners: `mouseenter` and `mouseleave` on each link

3. **CSS Styling:**
   - `.hero-link.hovered` - Same inverse highlight as `.selected`
   - Media query: Hover effects disabled on mobile (< 768px)
   - Desktop-only behavior preserves mobile interaction simplicity

4. **Preview Sync:**
   - Keyboard selection → updates preview + currentIndex
   - Click selection → updates preview + currentIndex
   - Hover → updates preview WITHOUT changing currentIndex
   - Mouse away → reverts preview to current selection

### Checklist - Day 10
- [x] Fix spacing with `white-space: pre` CSS property
- [x] Fix hover styling typo (double colon)
- [x] Implement hover-as-selection (Option A)
- [x] Add hover event listeners (mouseenter/mouseleave)
- [x] Add `.hovered` CSS class with media query
- [x] Sync preview on hover without changing selection
- [x] Fix TypeScript errors (unused imports, type annotations, loose equality)
- [x] Test hover behavior (desktop works, mobile has no hover)
- [x] Test keyboard navigation (still works perfectly)
- [x] Test click selection (still works perfectly)
- [x] Test preview sync (all three modes work correctly)
- [x] Test theme switching (colors adapt correctly)
- [x] Build passes with no errors

### Implementation Details

**File: `src/components/Hero.astro`**

New additions:
- `white-space: pre` in `.hero-link` CSS (line 23)
- `.hero-link.hovered` CSS class with inverse highlight (lines 35-38)
- Media query for desktop-only hover (lines 40-45)
- `hoveredIndex` state variable (line 78)
- `updateHoverUI(newHoverIndex)` function (lines 80-99)
- `clearHover()` function (lines 101-120)
- `mouseenter` and `mouseleave` event listeners (lines 155-162)

**File: `src/components/HeroPreview.astro`**

Fixed:
- Removed unused `updatePreview` function from frontmatter
- Type annotation added where needed

**Interaction Modes (All Working):**

| Mode | User Action | Visual Result | Preview | Selection State |
|------|-------------|---------------|---------|-----------------|
| **Keyboard** | Arrow down | `> about` + inverse highlight | Updates | currentIndex = 0 |
| **Click** | Click "projects" | `> projects` + inverse highlight | Updates | currentIndex = 1 |
| **Hover** | Mouse over "contact" | `> contact` + inverse highlight | Updates | currentIndex unchanged |
| **Hover Away** | Move mouse away | Shows current selection | Reverts | currentIndex unchanged |
| **Mobile** | Tap link | `> about` + inverse highlight | Updates | currentIndex = 0 |
| **Mobile** | Hover (< 768px) | No hover effect | No change | No change |

### Testing Summary

**✅ All Features Working:**
- Spacing visible on page load: `  about`, `  projects`, `  contact`
- Keyboard navigation: Arrow up/down cycles with wrapping ✓
- Click navigation: Select and navigate ✓
- Hover-as-selection: Shows styling without changing selection ✓
- Preview sync: Updates with keyboard, click, and hover ✓
- Theme switching: Light/dark modes adapt correctly ✓
- Mobile: No hover, tap/click works, preview hidden ✓
- Build: No errors, passes compilation ✓

### Known Limitations (For Future Sessions)

**Remaining TypeScript Warnings:**
- Some IDE warnings remain (non-blocking, doesn't affect build)
- Warnings appear to be related to Astro component imports
- Build passes successfully despite warnings
- Can address in future refactoring if needed

### Completed This Session

1. ✅ Fixed spacing with `white-space: pre` CSS
2. ✅ Implemented hover-as-selection (Option A):
   - Hover shows full selection styling
   - Preview updates on hover
   - currentIndex unchanged (keyboard still controls actual selection)
   - Desktop-only hover via media query
   - Mobile has no hover effects
3. ✅ Fixed all CSS/TypeScript errors found during coding
4. ✅ Tested all interaction modes comprehensively
5. ✅ Verified theme switching works with new features
6. ✅ Build passes with no errors
7. ✅ Documentation updated (BUILD_DIARY + NOTES)

### Next Steps (Ready for Implementation)

**Phase 3 (Pending):** Scroll-based auto-highlighting with IntersectionObserver
- Add `data-section` attributes to page content sections
- Create observer utility function
- Auto-highlight hero link when section enters viewport
- Keyboard/click selection can override auto-highlight

**Phase 4 (Pending):** Mobile refinement and responsive testing
- Test at multiple breakpoints
- Verify touch interactions
- Test accessibility features

**Phase 5 (Pending):** Add real page content
- Replace lorem ipsum in HeroPreview
- Build substantial About page
- Build Projects showcase
- Build Contact information page

---

## Day 11: ESC Key Handler & TypeScript Error Fixes (✅ Complete)

### Objectives
- Add ESC key handler to cancel selection and reset preview
- Fix all TypeScript/IDE errors in Hero.astro and HeroPreview.astro
- Extend `updatePreviewGlobal` to handle "initial" state
- Update documentation with all changes

### Session Flow & Key Discoveries

**Problem 1: TypeScript Errors in Hero.astro (9 errors)**
- **Issues Found:**
  - Line 62: Parameter `newIndex` implicitly `any`
  - Line 72: Property `dataset` does not exist on `Element`
  - Line 73: Property `updatePreviewGlobal` does not exist on `Window`
  - Line 79: Parameter `newHoverIndex` implicitly `any`
  - Line 95, 116: Same `dataset` error
  - Line 96, 117: Same `updatePreviewGlobal` error
  - Line 144: Property `click()` does not exist on `Element`
  - All errors requiring type assertions and casts

- **Solutions Applied:**
  - Added `: number` type annotations to function parameters (lines 62, 79)
  - Cast `Element` to `HTMLAnchorElement` for dataset access (lines 72, 95, 116)
  - Added non-null assertion `!` for `dataset.section` to handle potential `undefined`
  - Extended `Window` type for `updatePreviewGlobal` property
  - Cast `Element` to `HTMLAnchorElement` for `.click()` method (line 144)

**Problem 2: TypeScript Errors in HeroPreview.astro (2 errors)**
- **Issues Found:**
  - Line 39: `updatePreviewGlobal` not on `Window`
  - Line 40: Element index signature missing for sections object

- **Solutions Applied:**
  - Added `Section` and `Sections` interfaces for proper typing
  - Extended `Window` type to include `updatePreviewGlobal` property with proper signature
  - Cast sections object with `Record<string, Section>` type
  - Used double-cast pattern: `window as unknown as Window & { ... }` to satisfy TypeScript strict mode

**Problem 3: Missing ESC Key Handler**
- **Issue:** Hero component had keyboard support for Arrow keys and Enter, but no way to cancel selection
- **Solution:** Added `cancelSelection()` function that resets both selection and preview
- **Implementation:** Added ESC key handler to keydown event listener

### Architecture: ESC Key Handler (Option B)

**Implementation Approach:**
1. **Extend HeroPreview.astro** - Modified `updatePreviewGlobal()` to accept special "initial" key
2. **Add cancelSelection() Function** - New function in Hero.astro to reset state
3. **Add ESC Key Handler** - Added to existing keydown event listener

**Functions Created:**

1. **`cancelSelection()` in Hero.astro (after clearHover)**
   ```typescript
   function cancelSelection(): void {
     currentIndex = -1;
     hoveredIndex = -1;
     
     links.forEach((link, index) => {
       link.classList.remove("selected");
       link.classList.remove("hovered");
       link.textContent = "  " + originalTexts[index];
     });
     
     // Reset preview to initial message
     (window as unknown as Window & { updatePreviewGlobal?: (key: string) => void })
       .updatePreviewGlobal?.("initial");
   }
   ```

2. **ESC Handler in keydown listener**
   ```typescript
   } else if (event.key === "Escape") {
     event.preventDefault();
     cancelSelection();
   }
   ```

3. **Enhanced `updatePreviewGlobal()` in HeroPreview.astro**
   - Added check for `sectionKey === "initial"`
   - Resets preview to initial message when ESC is pressed
   - No need to call function from Hero; just pass "initial" string

### Checklist - Day 11
- [x] Fix all 9 TypeScript errors in Hero.astro
  - [x] Add `: number` type annotations
  - [x] Cast Element to HTMLAnchorElement
  - [x] Add non-null assertions for dataset.section
  - [x] Extend Window type for updatePreviewGlobal
  - [x] Cast for .click() method
- [x] Fix all 2 TypeScript errors in HeroPreview.astro
  - [x] Add Section and Sections interfaces
  - [x] Extend Window type with double-cast pattern
  - [x] Cast sections object with Record type
- [x] Add `cancelSelection()` function to Hero.astro
- [x] Add ESC key handler to keydown listener
- [x] Modify `updatePreviewGlobal()` to handle "initial" state
- [x] Test ESC key functionality (selection and preview reset)
- [x] Test all three interaction modes still work (keyboard, click, hover)
- [x] Verify build passes with no errors
- [x] Update BUILD_DIARY.md with Day 11 session
- [x] Update NOTES.md with ESC handler and TypeScript fixes

### Implementation Details

**File: `src/components/Hero.astro`**

TypeScript Fixes:
- Line 62: `function updateSelection(newIndex: number)`
- Line 72: `const sectionKey = (links[newIndex] as HTMLAnchorElement).dataset.section!;`
- Line 73: `(window as Window & { updatePreviewGlobal?: (key: string) => void }).updatePreviewGlobal?.(sectionKey);`
- Line 79: `function updateHoverUI(newHoverIndex: number)`
- Lines 95, 96, 116, 117: Same pattern as 72-73
- Line 144: `(links[currentIndex] as HTMLAnchorElement).click();`

New Feature:
- Added `cancelSelection()` function after `clearHover()` (~12 lines)
- Added ESC key handler in keydown listener (~3 lines)

**File: `src/components/HeroPreview.astro`**

TypeScript Fixes:
- Added interfaces (lines 21-28):
  ```typescript
  interface Section {
    name: string;
    description: string;
  }
  
  interface Sections {
    [key: string]: Section;
  }
  ```
- Line 30: `const sections: Sections = { ... }`
- Line 48: Double-cast for Window: `window as unknown as Window & { ... }`
- Line 49: Cast sections: `(sections as Record<string, Section>)[sectionKey]`

Enhanced Feature:
- Added "initial" state handling in `updatePreviewGlobal()` (~5 lines)

### ESC Key Behavior (Complete Flow)

| State | User Action | Visual Result | Preview | `currentIndex` |
|-------|-------------|---------------|---------|----------------|
| Keyboard selection (about) | Press ESC | No highlight | Initial message | = -1 |
| Click selection (projects) | Press ESC | No highlight | Initial message | = -1 |
| Hover preview | Press ESC | No highlight | Initial message | = -1 |
| After ESC cancel | Arrow Down | `> about` + inverse | About description | = 0 |

### Testing Summary

**✅ All Features Working:**
- Keyboard navigation (Arrow up/down + Enter) ✓
- Click/tap selection ✓
- Hover-as-selection with preview sync ✓
- **NEW:** ESC cancels selection and resets preview ✓
- Spacing visible on page load ✓
- Theme switching ✓
- Mobile interactions ✓
- Build: No errors, passes compilation ✓

### TypeScript Fixes Summary

**Hero.astro (9 fixes):**
- 2 function parameter type annotations
- 4 Element → HTMLAnchorElement casts with dataset
- 4 non-null assertions for dataset.section
- 4 Window type extensions
- 1 Element → HTMLAnchorElement cast for .click()

**HeroPreview.astro (2 fixes):**
- 2 interfaces added (Section, Sections)
- 1 type annotation on sections object
- 1 double-cast for Window
- 1 type assertion for sections access

**Build Result:** ✅ All errors resolved, build passes with no errors

### Completed This Session

1. ✅ Fixed all 9 TypeScript errors in Hero.astro using type assertions
2. ✅ Fixed all 2 TypeScript errors in HeroPreview.astro with interfaces and casts
3. ✅ Implemented ESC key handler (Option B approach):
   - Added `cancelSelection()` function
   - Extended `updatePreviewGlobal()` to handle "initial" state
   - Added ESC key listener to keydown event
4. ✅ Tested all interaction modes:
   - Keyboard selection + ESC → reset ✓
   - Click selection + ESC → reset ✓
   - Hover preview + ESC → reset ✓
   - Can select again after ESC ✓
5. ✅ Verified build passes with no errors
6. ✅ Updated documentation (BUILD_DIARY + NOTES)

### Next Steps (Ready for Implementation)

**Phase 4 (Pending):** Scroll-based auto-highlighting with IntersectionObserver
- Add `data-section` attributes to page content sections
- Create observer utility function
- Auto-highlight hero link when section enters viewport
- Keyboard/click/ESC selection can override auto-highlight

**Phase 5 (Pending):** Mobile refinement and responsive testing
- Test at multiple breakpoints
- Verify touch interactions
- Test accessibility features

**Phase 6 (Pending):** Add real page content
- Replace lorem ipsum in HeroPreview
- Build substantial About page
- Build Projects showcase
- Build Contact information page

---

## Day 13: Component Refactoring & Persistent Selection (✅ Complete)

### Objectives
- Refactor hero links into self-contained HeroLink component
- Move `<a>` tag into HeroLink component for better encapsulation
- Fix whitespace prefixes that were collapsing in templates
- Implement persistent selection on mouseleave (don't clear on hover exit)
- Update both BUILD_DIARY.md and NOTES.md with final implementations

### Session Flow & Key Discoveries

**Problem 1: Whitespace Prefixes Collapsing in Templates**
- **Issue:** Prefixes only appeared upon hover/selection, not on page load
- **Root Cause:** Astro's template processing was collapsing regular spaces `'  '` to single spaces
- **Solution:** Used Unicode non-breaking space escape `'\u00A0\u00A0'` in both:
  - HeroLink.astro template (line 13)
  - Hero.astro JavaScript functions (lines 71, 92)
- **Verification:** Hex dump confirmed UTF-8 encoding `c2 a0` (U+00A0) in final HTML
- **Result:** Prefixes now visible instantly on page load with fixed `2ch` width

**Problem 2: Hero Links in Horizontal Row Instead of Vertical**
- **Issue:** After moving `<a>` tag to HeroLink component, links displayed horizontally
- **Root Cause:** CSS was scoped to Hero.astro but styles moved to HeroLink.astro
- **Solution:** Moved all CSS rules to HeroLink.astro with `display: block`
- **Result:** Links display vertically as intended

**Problem 3: Link Text Smaller Than Body Text**
- **Issue:** Hero link text appeared noticeably smaller
- **Root Cause:** `.hero-link` was missing explicit `font-size`
- **Solution:** Added `font-size: 1rem` to `.hero-link` CSS class (line 28 in HeroLink.astro)
- **Result:** Text now matches body text size

**Problem 4: Trailing Dots Disappeared**
- **Issue:** Aesthetic trailing dots (`about.......`, `projects....`, `contact.....`) were removed
- **Root Cause:** Refactoring used `name` prop for both href AND display text
- **Solution:** Added `displayName` prop to HeroLink component
  - `name` prop: used for href and data-section (clean URLs: `/about`)
  - `displayName` prop: used for text content (with dots)
- **Result:** Aesthetic dots restored while maintaining clean navigation

**Problem 5: Mouseleave Clearing Selection**
- **Issue:** Current behavior cleared selection when mouse left a hovered link
- **Desired Behavior:** Selection should persist at last hover point until keyboard/click changes it
- **Solution:** Delete the `mouseleave` event listener from Hero.astro (lines 144-146)
  - `currentIndex` now stays at hovered link value
  - Arrow keys continue from last hovered link
  - Escape key still clears selection (cancelSelection() still works)
- **Implementation:** Removed 3 lines of code; everything else handles persistence automatically

### Architecture: Component-Based Hero Links

**HeroLink Component Structure:**
- Self-contained component with all styling and logic
- Props: `name` (for href/data-section), `displayName` (for visible text), `isSelected`, `dataSection`
- Renders `<a>` tag internally (fully self-contained)
- Uses fixed-width prefix spans to prevent size shifting
- CSS scoped to component with Astro's automatic scoping

**Hero Component (Simplified):**
- Renders three HeroLink components with initial `isSelected={false}`
- State management only (keyboard, click, hover handlers)
- No duplicate CSS
- Cleaner separation of concerns

**File Structure:**
```
src/components/
├── Hero.astro          (State management + orchestration)
├── HeroLink.astro      (Self-contained link component)
├── HeroPreview.astro   (Preview box)
└── HeroSection.astro   (Wrapper combining Hero + HeroPreview)
```

### Checklist - Day 13

**Whitespace & Visual Issues:**
- [x] Fix prefix whitespace collapsing with `\u00A0\u00A0` Unicode escapes
- [x] Fix links displaying horizontally (move CSS to HeroLink)
- [x] Fix text size (add `font-size: 1rem`)
- [x] Restore trailing dots with `displayName` prop
- [x] Verify build succeeds with no errors

**Component Refactoring:**
- [x] Move `<a>` tag into HeroLink.astro
- [x] Add `displayName` prop to separate URLs from display text
- [x] Move all CSS styling to HeroLink.astro
- [x] Update Hero.astro to remove duplicate CSS
- [x] Simplify Hero.astro by removing wrapper elements
- [x] Test all interactions (keyboard, click, hover, escape)

**Persistent Selection Feature:**
- [x] Remove mouseleave event listener that was clearing selection
- [x] Verify `currentIndex` stays at last hovered value
- [x] Verify arrow keys start from last hover point
- [x] Verify Escape key still clears selection
- [x] Test complete interaction flow

**Documentation:**
- [x] Update BUILD_DIARY.md with Day 13 session details
- [x] Update NOTES.md with HeroLink component pattern
- [x] Document whitespace Unicode escape solution
- [x] Document persistent selection behavior

### Implementation Details

**File: `src/components/HeroLink.astro`**

Changes:
- Line 11: `<a href={`/${name}`} class="hero-link" data-section={name}>`
- Line 13: Display name uses `{displayName}` prop
- Line 13: Default prefix uses `'\u00A0\u00A0'` (Unicode non-breaking spaces)
- Lines 19-50: All CSS moved here (complete style block)
- Line 28: Added `font-size: 1rem` to `.hero-link`

**File: `src/components/Hero.astro`**

Changes:
- Lines 8-10: Updated to pass both `name` and `displayName` props
- Removed duplicate CSS block (lines 21-50 in previous version)
- Lines 71, 92: Updated to use `'\u00A0\u00A0'` Unicode escapes
- **Removed:** Lines 144-146 (mouseleave listener that was clearing selection)

**File: `src/components/Hero.astro` (JavaScript)**

The rest of the JavaScript remains unchanged:
- `updateSelection()` still works correctly
- `cancelSelection()` still works for Escape key
- Keyboard navigation works from persistent `currentIndex`
- Hover preview still syncs without changing selection

### Testing Summary

**✅ Component Structure:**
- HeroLink is fully self-contained ✓
- All styling in HeroLink component ✓
- No CSS duplication ✓
- Clean separation of concerns ✓

**✅ Visual Display:**
- Prefixes visible on page load ✓
- Links display vertically (not horizontal) ✓
- Text size matches body text ✓
- Trailing dots present (`about.......`, etc.) ✓
- No size shift when selecting ✓

**✅ Persistent Selection:**
- Hover: shows selection styling + preview ✓
- Mouseleave: selection stays (not cleared) ✓
- Arrow keys: start from last hover point ✓
- Escape: still clears selection completely ✓
- Click: still navigates and selects ✓
- Keyboard: still controls real selection ✓

**✅ Build & Quality:**
- Build passes with no errors ✓
- No TypeScript errors ✓
- All themes work (light/dark) ✓
- Mobile interactions work ✓

### Key Improvements

| Aspect | Before | After |
|--------|--------|-------|
| **Component Encapsulation** | `<a>` in Hero, styles split | HeroLink fully self-contained |
| **CSS Duplication** | Duplicate styles | Single source of truth |
| **URL/Display Separation** | Combined in one prop | `name` vs `displayName` |
| **Whitespace Handling** | Regular spaces (collapsed) | Unicode `\u00A0` (preserved) |
| **Mouseleave Behavior** | Cleared selection | Persists selection |
| **Code Organization** | 148 lines in Hero.astro | Split across components |

### Completed This Session

1. ✅ Fixed whitespace prefix collapsing using Unicode non-breaking spaces
2. ✅ Refactored hero links into self-contained HeroLink component
3. ✅ Moved `<a>` tag and all CSS into HeroLink component
4. ✅ Fixed text sizing (added `font-size: 1rem`)
5. ✅ Restored trailing dots with `displayName` prop
6. ✅ Implemented persistent selection on mouseleave:
   - Removed mouseleave listener
   - Selection stays at last hover point
   - Arrow keys continue from persistent position
   - Escape key still clears everything
7. ✅ Verified all interactions work correctly
8. ✅ Updated BUILD_DIARY.md with comprehensive session notes
9. ✅ Updated NOTES.md with HeroLink pattern and solutions
10. ✅ Build passes with no errors

### Architecture Improvements Achieved

**Better Component Isolation:**
- Each component owns its HTML, CSS, and props
- No interdependencies between components
- Easy to test and maintain

**Cleaner State Management:**
- Hero.astro focuses purely on state (keyboard, click, hover)
- HeroLink focuses purely on rendering
- Clear separation of concerns

**Persistent Selection UX:**
- Users can hover to preview different sections
- Selection persists, allowing arrow key navigation from hover point
- More intuitive than clearing on every mouseleave
- Escape key still provides "clear everything" option

### Next Steps (Ready for Implementation)

**Phase 4 (Pending):** Scroll-based auto-highlighting with IntersectionObserver
- Add `data-section` attributes to page content sections
- Create observer utility function
- Auto-highlight hero link when section enters viewport
- Keyboard/click/ESC selection can override auto-highlight

**Phase 5 (Pending):** Mobile refinement and responsive testing
- Test at multiple breakpoints
- Verify touch interactions
- Test accessibility features

**Phase 6 (Pending):** Add real page content
- Replace lorem ipsum in HeroPreview
- Build substantial About page
- Build Projects showcase
- Build Contact information page

---

## Day 12: HeroPreview Text Truncation & Navbar Grid Layout (✅ Complete)

### Objectives
- Implement elegant text truncation in HeroPreview with "..." and "read more" link
- Restructure Navbar layout with CSS Grid for three-part alignment
- Fix responsive behavior on mobile breakpoints
- Make HeroPreview visible on tablet breakpoints (md and up)

### Session Flow & Key Discoveries

**Problem 1: Text Overflow in HeroPreview Container**
- **Issue:** Description text exceeded h-64 container height without visual indication
- **Initial Solution Attempted:** Added `overflow: hidden` to CSS
- **Problem with Initial Solution:** Text was simply clipped without "..." indicator
- **User Preference:** Wanted elegant solution with "..." and "read more →" link
- **Final Solution:** Implemented character-based truncation with "read more" link

**Problem 2: HeroPreview Display at Different Breakpoints**
- **Current Status:** Hidden below lg breakpoint, visible lg and up
- **User Request:** Show on tablet (md and up) as well
- **Change Made:** Modified `hidden lg:block` → `hidden md:block`
- **Result:** Now visible on tablets and desktops, hidden only on mobile

**Problem 3: Navbar Layout Not Truly Centered**
- **Issue:** Links appeared shifted right instead of screen-centered
- **Root Cause:** Using `grid-cols-[auto_1fr_auto]` distributed space unevenly (logo narrower than toggle)
- **Solution A Attempted:** Change to `grid-cols-3` for equal-width columns
- **Result:** Links now perfectly centered on screen
- **Additional Issue:** Mobile hamburger appeared too far left
- **Root Cause:** 3-column grid on mobile collapsed middle column, throwing off layout
- **Solution B:** Use responsive grid - `grid-cols-2 md:grid-cols-3`
- **Result:** Mobile now shows 2 columns (logo | hamburger), desktop shows 3 columns with centered links

**Problem 4: ThemeToggle Component Type Error**
- **Issue:** TypeScript error: `class` prop not supported on ThemeToggle component
- **Attempted Solution:** Pass `class="hidden md:flex"` directly to component
- **Error:** Component doesn't accept arbitrary class props
- **Solution Applied:** Wrapped ThemeToggle in a div with visibility classes (Option A)
- **Result:** TypeScript error resolved, functionality unchanged

### Architecture: Text Truncation with "Read More" Link

**Implementation Approach:**
1. **Flex Layout:** Container uses `flex flex-col` to stack content and link
2. **Truncation Function:** `truncateToCharCount()` breaks at word boundary
3. **Dynamic Link:** Updates href based on selected section (`/about`, `/projects`, `/contact`)
4. **Visibility Toggle:** Link hidden on initial state, shown when section selected

**Functions Created:**

1. **`truncateToCharCount(text, maxChars)`** (Utility Function)
   ```typescript
   function truncateToCharCount(text: string, maxChars: number): { text: string; isTruncated: boolean } {
     if (text.length <= maxChars) return { text, isTruncated: false };
     const truncated = text.substring(0, maxChars);
     const lastSpace = truncated.lastIndexOf(' ');
     const finalText = lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated;
     return { text: finalText + '...', isTruncated: true };
   }
   ```

2. **Enhanced `updatePreviewGlobal(sectionKey)`**
   - Truncates description to ~200 characters (roughly 4 lines)
   - Shows "read more →" link with correct href
   - Hides link when showing initial state
   - Uses `readMoreLink.classList.add/remove('hidden')`

### Architecture: CSS Grid Navbar Layout

**Problem Analysis:**
- Single 3-column grid on all breakpoints caused mobile layout issues
- Hidden middle column (links) didn't free up space for hamburger

**Solution: Responsive Grid Columns**
- Mobile (< md): `grid-cols-2` - Logo | Hamburger
- Desktop (≥ md): `grid-cols-3` - Logo | Links | Toggle+Hamburger

**Layout Results:**

| Breakpoint | Grid | Logo | Links | Toggle | Hamburger | Result |
|-----------|------|------|-------|--------|-----------|--------|
| **Mobile** | 2 cols | Col 1 | Hidden | Hidden | Col 2 | Balanced |
| **Desktop** | 3 cols | Col 1 | Col 2 centered | Col 3 | Hidden | Perfect |

### Checklist - Day 12

**HeroPreview Text Truncation:**
- [x] Add flex layout to container (`flex flex-col`)
- [x] Add flex-1 overflow-hidden to preview content
- [x] Add "read more →" link HTML with hidden class
- [x] Update CSS for flex layout (remove max-height conflicts)
- [x] Implement truncateToCharCount() function
- [x] Update updatePreviewGlobal() to use truncation
- [x] Make link hidden on initial state
- [x] Link shows/hides based on section selection
- [x] Test truncation across all sections
- [x] Verify "read more" links to correct pages

**HeroPreview Breakpoint Change:**
- [x] Change from `hidden lg:block` to `hidden md:block`
- [x] Verify visible on tablet breakpoints
- [x] Build verification - no errors

**Navbar Grid Layout:**
- [x] Analyze mobile layout issue (hamburger too far left)
- [x] Identify root cause (3-column grid collapsing middle)
- [x] Implement responsive grid: `grid-cols-2 md:grid-cols-3`
- [x] Test desktop layout (logo, centered links, toggle on right)
- [x] Test mobile layout (logo, hamburger balanced)
- [x] Fix ThemeToggle component type error (wrap in div)
- [x] Verify all breakpoints
- [x] Build verification - no errors

### Implementation Details

**File: `src/components/HeroPreview.astro`**

Changes:
- Line 7: Container now uses `flex flex-col` layout
- Line 8: Content div has `flex-1 overflow-hidden` for space management
- Lines 14-20: Added "read more →" link with `hidden` class
- CSS: Updated for flex layout, removed `max-height` conflicts
- Script: Added `truncateToCharCount()` function
- Script: Updated `updatePreviewGlobal()` to handle truncation and link visibility

**File: `src/components/Navbar.astro`**

Changes:
- Line 14: Changed from `grid grid-cols-3 gap-4 items-center` to `grid grid-cols-2 md:grid-cols-3 gap-4 items-center`
- Line 29-31: Wrapped ThemeToggle in div with visibility classes
- All responsive breakpoints now working correctly

**File: `src/components/HeroSection.astro`**

Changes:
- Line 15: Changed from `hidden lg:block` to `hidden md:block`
- HeroPreview now shows on tablets and desktops

### Testing Summary

**✅ HeroPreview Text Truncation:**
- Text truncates to ~4 lines with "..." ✓
- "Read more →" link appears only when section selected ✓
- Link hidden on initial state (no section) ✓
- Link href correctly points to `/about`, `/projects`, `/contact` ✓
- Truncation preserves word boundaries (not mid-word) ✓
- Works in light and dark themes ✓

**✅ HeroPreview Breakpoint:**
- Hidden on mobile (< md) ✓
- Visible on tablet (md, lg) ✓
- Visible on desktop (xl, 2xl) ✓

**✅ Navbar Grid Layout:**
- Mobile: Logo left, hamburger far right (balanced) ✓
- Desktop: Logo left, links centered, toggle right ✓
- All breakpoints display correctly ✓
- TypeScript errors resolved ✓
- Build passes with no errors ✓

### Design Decisions

**Text Truncation Approach:**
- **Character-based (200 chars):** More predictable than line-based; adapts to different fonts
- **Word boundary breaking:** Avoids awkward mid-word truncation
- **"..." indicator:** Signals more content available
- **"Read more" link:** Clear CTA to full section

**Navbar Layout:**
- **Responsive grid:** Handles mobile and desktop elegantly with single grid structure
- **Equal column widths on desktop:** Ensures links truly centered on screen
- **2-column mobile:** Distributes space evenly (logo takes ~50%, hamburger takes ~50%)
- **Centered links:** Uses `justify-center` within column for perfect centering

**HeroPreview Visibility:**
- **md breakpoint:** Sweet spot for tablet display; readable at medium screen sizes
- **Hidden only on mobile:** Reduces clutter on small screens where space is precious
- **No changes to mobile menu:** Preview link still available in dropdown

### Completed This Session

1. ✅ Implemented elegant text truncation in HeroPreview:
   - Character-based truncation to ~200 characters
   - Word boundary breaking (no mid-word cuts)
   - "..." indicator for truncated text
   - "Read more →" link with dynamic href

2. ✅ Fixed link visibility:
   - Link hidden on initial state
   - Link shows when section selected
   - Correct href based on active section

3. ✅ Restructured Navbar with responsive CSS Grid:
   - Mobile: 2-column grid (logo | hamburger)
   - Desktop: 3-column grid (logo | links | toggle)
   - Links perfectly centered on screen

4. ✅ Fixed mobile navbar layout:
   - Hamburger no longer appears too far left
   - Logo and hamburger evenly distributed
   - Responsive grid adapts naturally

5. ✅ Made HeroPreview visible on tablet breakpoints:
   - Changed from `hidden lg:block` to `hidden md:block`
   - Now shows on md, lg, xl, 2xl breakpoints
   - Hidden only on mobile (< md)

6. ✅ Resolved TypeScript errors:
   - Wrapped ThemeToggle in div for visibility classes
   - Fixed type compatibility issue

7. ✅ Build passes with no errors

### Next Steps (Ready for Implementation)

**Phase 4 (Pending):** Scroll-based auto-highlighting with IntersectionObserver
- Add `data-section` attributes to page content sections
- Create observer utility function
- Auto-highlight hero link when section enters viewport
- Keyboard/click/ESC selection can override auto-highlight

**Phase 5 (Pending):** Mobile refinement and responsive testing
- Test at multiple breakpoints
- Verify touch interactions
- Test accessibility features

**Phase 6 (Pending):** Add real page content
- Replace lorem ipsum in HeroPreview with actual descriptions
- Build substantial About page
- Build Projects showcase
- Build Contact information page

---

## Day 12 Addendum: Hero.astro Best Practice Refactor (✅ Complete)

### Objective
Refactor Hero.astro to use Astro best practices: replace classList operations with data-* attributes for state management, improving code semantics and maintainability.

### Rationale for Refactor

**Research Findings:**
After consulting Astro documentation and TypeScript best practices, determined that the hybrid approach (Tailwind + scoped CSS) is correct, but state management could be improved:

**Problem with classList approach:**
- ❌ State hidden in class names (harder to inspect)
- ❌ Multiple classes for single state (`.selected`, `.hovered`)
- ❌ CSS rules target classes (semantic mismatch)
- ❌ Harder to debug in DevTools

**Solution with data-* attributes:**
- ✅ State explicit and visible (inspect `data-state` attribute)
- ✅ Single attribute for all state variations
- ✅ CSS rules target data attributes (semantic alignment)
- ✅ Clear state values: `"default"`, `"selected"`, `"hovered"`
- ✅ Aligns with Astro scoped CSS best practices

### Implementation Details

**Change 1: TypeScript Type Cast (Line 49)**
```typescript
// BEFORE: const links = document.querySelectorAll(".hero-link");
// Type: NodeListOf<Element> - doesn't have .dataset

// AFTER: Added type assertion
const links = document.querySelectorAll(".hero-link") as NodeListOf<HTMLAnchorElement>;
// Type: NodeListOf<HTMLAnchorElement> - has .dataset
```

**Reason:** TypeScript strict mode requires explicit casting. The generic `Element` type doesn't have `.dataset` property; must cast to `HTMLAnchorElement`.

**Change 2: CSS Selectors (Lines 29-44)**
- Line 29: `.hero-link.selected` → `.hero-link[data-state="selected"]`
- Line 34: `.hero-link.hovered` → `.hero-link[data-state="hovered"]` (fixed syntax error: removed extra dot)
- Line 40: Media query selector updated to `.hero-link[data-state="hovered"]`

**Change 3: Initialize State (Line 60)**
```typescript
links.forEach((link, index) => {
  link.textContent = "  " + originalTexts[index];
  link.dataset.state = "default";  // ← ADD: explicit initial state
});
```

**Change 4: updateSelection() Function**
- Line 65: `link.classList.remove("selected")` → `link.dataset.state = "default"`
- Line 70: `links[newIndex].classList.add("selected")` → `links[newIndex].dataset.state = "selected"`

**Change 5: updateHoverUI() Function**
- Line 86: `link.classList.add("hovered")` → `link.dataset.state = "hovered"`
- Line 89: `link.classList.add("selected")` → `link.dataset.state = "selected"`
- Line 92: Two classList removes → single `link.dataset.state = "default"`

**Change 6: clearHover() Function**
- Removed: `link.classList.remove("hovered")`
- Line 111: `link.classList.add("selected")` → `link.dataset.state = "selected"`
- Line 114: `link.classList.remove("selected")` → `link.dataset.state = "default"`

**Change 7: cancelSelection() Function**
- Line 134: Two classList removes → single `link.dataset.state = "default"`

### State Mapping Table

| Interaction | Before (classList) | After (dataset) | Visual Result |
|-------------|-------------------|-----------------|---------------|
| **Page load** | No class | `data-state="default"` | `  about` spacing |
| **Arrow Down** | `.selected` added | `data-state="selected"` | `> about` inverse highlight |
| **Mouse hover** | `.hovered` added | `data-state="hovered"` | `> about` inverse highlight (desktop only) |
| **Hover away** | `.hovered` removed | `data-state="default"` | `  about` spacing |
| **Click link** | `.selected` added | `data-state="selected"` | `> about` inverse highlight |
| **ESC key** | Both removed | `data-state="default"` | `  about` spacing |
| **Mobile hover** | `.hovered` (no style) | `data-state="hovered"` (no style via media query) | `  about` no highlight |

### Verification Checklist - All Passing ✅

**TypeScript:**
- ✅ Type cast enables `.dataset` access
- ✅ No TypeScript errors
- ✅ All dataset assignments are type-safe

**CSS:**
- ✅ Syntax error fixed (removed extra dot before bracket)
- ✅ All three selectors using `[data-state="value"]` syntax
- ✅ Media query targets correct attribute

**JavaScript:**
- ✅ All 9 classList operations converted to dataset
- ✅ Initial state set on page load
- ✅ State properly managed in all functions

**Build:**
- ✅ `npm run build` passes with no errors
- ✅ All pages build successfully (/, /about, /projects, /contact)
- ✅ No TypeScript warnings

**Functionality:**
- ✅ Keyboard navigation (arrow keys) works correctly
- ✅ Selection persists and displays correctly
- ✅ Hover preview updates and restores correctly
- ✅ ESC key resets state properly
- ✅ Click selection works
- ✅ Mobile hover styling disabled (via media query)
- ✅ Theme switching works (colors adapt correctly)

### Before & After Code Example

**Before (classList pattern):**
```javascript
link.classList.add('selected');
link.classList.add('hovered');
link.classList.remove('selected');
```

```css
.hero-link.selected { ... }
.hero-link.hovered { ... }
```

**After (data-* pattern):**
```javascript
link.dataset.state = 'selected';
link.dataset.state = 'hovered';
link.dataset.state = 'default';
```

```css
.hero-link[data-state="selected"] { ... }
.hero-link[data-state="hovered"] { ... }
```

### Why This Matters

**DevTools Inspection:**
- **Before:** Have to read HTML class names to understand state
- **After:** State clearly visible in DOM attributes (easier debugging)

**Code Semantics:**
- **Before:** State scattered across multiple class names
- **After:** Single source of truth (`data-state` attribute)

**Maintainability:**
- **Before:** Must remember which classes represent which states
- **After:** State values are self-documenting

**Astro Best Practices:**
- Aligns with scoped CSS pattern recommended by Astro
- Data-driven styling (state in attributes, not classes)
- Hybrid approach: Tailwind for layout, scoped CSS for complex state

### Files Modified
- `src/components/Hero.astro`
  - CSS: 3 selectors updated
  - JavaScript: 9 locations updated
  - Type safety: Added TypeScript cast
  - No breaking changes; all functionality preserved

### Commit Message
```
Day 12 Addendum: Hero.astro best practice refactor

Refactored state management from classList to data-* attributes:
- Replaced .classList.add/remove with link.dataset.state assignments
- Updated CSS selectors from .hero-link.selected to [data-state="selected"]
- Added TypeScript cast for NodeListOf<HTMLAnchorElement>
- Fixed CSS syntax error (removed extra dot before bracket)
- All state now explicit and inspectable in DevTools
- Maintains all functionality; improves code semantics
- Aligns with Astro scoped CSS best practices

Changes:
- CSS: 3 selectors refactored (lines 29, 34, 40)
- JavaScript: 9 dataset assignments (lines 60, 65, 70, 86, 89, 92, 111, 114, 134)
- TypeScript: Added cast (line 49)
- Tests: Build passes, all functionality verified
```

---

## Day 13: Bloom Effect Implementation (Phase 1) - OLD SCREEN AESTHETIC ✅ COMPLETE

### Objectives
- Add subtle bloom/glow effect to UI (text, borders)
- Emulate old CRT screen aesthetic
- Create reusable CSS utility classes
- Integrate theme-aware bloom colors (light/dark modes)
- Apply bloom to key components (Hero, Navbar, HeroPreview, ThemeToggle)

### Implementation Approach
- **Technology:** CSS `filter: drop-shadow()` for subtle glow
- **Intensity:** Subtle (not pronounced CRT scanlines, just soft glow)
- **Scope:** Text + borders (not all elements)
- **Colors:** Theme-aware (automatic light/dark adaptation)
- **Performance:** GPU-accelerated, minimal overhead

### Key Design Decisions

**Why CSS filter drop-shadow()?**
- Native CSS, GPU-accelerated (good performance)
- Works perfectly on text without affecting readability
- Color automatically matches theme variables
- Minimal code changes needed
- Subtle and elegant

**Why theme-aware bloom colors?**
- Light mode: Lower opacity (0.2) with brand color to avoid washed-out appearance
- Dark mode: Slightly higher opacity (0.25) with lighter brand color for authentic CRT glow
- Both automatically adapt when theme switches

**Bloom Filter Parameters:**
- `.bloom-text`: `filter: drop-shadow(0 0 4px var(--color-bloom))`
  - 4px blur radius for text (soft, readable)
  - Creates gentle halo around characters
- `.bloom-border`: `filter: drop-shadow(0 0 3px var(--color-bloom))`
  - 3px blur radius for borders (slightly tighter)
  - Creates soft edge glow

### Checklist - Day 13 (Phase 1)

**Setup:**
- [x] Add `--color-bloom` variable to light theme in tokens.css
- [x] Add `--color-bloom` variable to dark theme in tokens.css
- [x] Create `.bloom-text` utility class in global.css
- [x] Create `.bloom-border` utility class in global.css

**Implementation:**
- [x] Apply bloom effect to Hero.astro (text links + border)
- [x] Apply bloom effect to Navbar.astro (nav links + mobile menu border)
- [x] Apply bloom effect to HeroPreview.astro (preview content + border)
- [x] Apply bloom effect to ThemeToggle.astro (theme icons)

**Testing & Verification:**
- [x] Build passes with no errors
- [x] Visual inspection: bloom visible on all elements
- [x] Light theme: Subtle warm purple glow ✓
- [x] Dark theme: Subtle cool purple glow ✓
- [x] Theme switching: Bloom adapts instantly ✓
- [x] No performance issues detected

### Bloom Color Palette

**Light Theme:**
- `--color-bloom: rgba(91, 33, 182, 0.2)`
- Brand color (#5b21b6 - dark purple) at 20% opacity
- Creates subtle warm glow without overwhelming light background
- Pairs well with #2d2d2d text color

**Dark Theme:**
- `--color-bloom: rgba(167, 139, 250, 0.25)`
- Lighter brand color (#a78bfa - light purple) at 25% opacity
- Creates soft cool glow authentic to CRT aesthetic
- Matches dark background (#1a1a1a) and light text (#f0f0f0)

### Files Modified

**1. `src/styles/tokens.css`**
- Line 9: Added `--color-bloom: rgba(91, 33, 182, 0.2);` to light theme
- Line 19: Added `--color-bloom: rgba(167, 139, 250, 0.25);` to dark theme

**2. `src/styles/global.css`**
- Lines 37-44: Added bloom utility classes
  - `.bloom-text`: `filter: drop-shadow(0 0 4px var(--color-bloom))`
  - `.bloom-border`: `filter: drop-shadow(0 0 3px var(--color-bloom))`

**3. `src/components/Hero.astro`**
- Line 5: Added `bloom-border` class to hero container div
- Line 21: Added `filter: drop-shadow(0 0 4px var(--color-bloom));` to `.hero-link` CSS

**4. `src/components/Navbar.astro`**
- Line 7: Added `bloom-text bloom-border` classes to linkClasses variable
- Line 8: Added `bloom-text` class to logoClass variable
- Line 45: Added `bloom-border` class to mobile menu inner container

**5. `src/components/HeroPreview.astro`**
- Line 7: Added `bloom-border` class to container
- Line 10: Added `bloom-text` class to preview content div
- Line 17: Added `bloom-text` class to "read more" link

**6. `src/components/ThemeToggle.astro`**
- Line 11: Added `bloom-text` class to toggleClass variable

### Visual Results

**Hero Component:**
- Navigation links have soft purple glow
- Container border glows subtly
- Text remains fully readable
- Hover and selected states work perfectly with bloom

**Navbar:**
- Logo has gentle glow (thematic)
- Navigation links glow when hovered
- Mobile menu border glows when expanded
- Theme toggle icons glow (subtle, themed)

**HeroPreview:**
- Text content glows (easy to read)
- Container border glows (terminal aesthetic)
- "Read more" link glows (cohesive design)

**Overall Aesthetic:**
- Subtle old-screen feel achieved
- Not overdone (bloom doesn't overwhelm)
- Cohesive across all components
- Automatically adapts to theme changes

### Testing Summary

✅ **Build:** Passes with no errors
✅ **Light Mode:** Purple bloom visible, not too bright
✅ **Dark Mode:** Light purple bloom visible, authentic CRT feel
✅ **Theme Switch:** Bloom colors transition smoothly with theme
✅ **Responsive:** Works on all breakpoints (mobile, tablet, desktop)
✅ **Performance:** No lag detected; GPU-accelerated
✅ **Accessibility:** Text remains fully readable; no impact on contrast

### Known Limitations & Future Enhancements

**Phase 2 (Next Session - Comprehensive Bloom Expansion):**
- Apply bloom to ALL text and borders site-wide
- Add bloom to interactive elements (buttons, inputs, forms)
- Extend bloom to page sections and containers
- Consider subtle bloom on headings
- Add bloom to footer and secondary UI

**Phase 3 (Future - Advanced Effects):**
- Experiment with color-shifting bloom (RGB phosphor effect)
- Add subtle scanline overlay (CSS pattern)
- Consider animated bloom pulse (breathing effect)
- Test with different blur radii for effect variation

**Phase 4 (Future - Performance Optimization):**
- Profile performance across devices (mobile, tablet, desktop)
- Consider reducing bloom intensity on low-end devices
- Test at 60fps+ to ensure smooth interactions

### Next Steps (For Next Session)

1. **Expand bloom to all site text/borders** (Phase 2 full implementation)
2. **Add bloom to form elements and buttons** (when implemented)
3. **Test bloom on additional pages** (About, Projects, Contact)
4. **Gather user feedback** on bloom intensity
5. **Document bloom design system** in NOTES.md

### Completed This Session

1. ✅ Identified optimal bloom implementation approach (CSS filter drop-shadow)
2. ✅ Created theme-aware bloom color variables (light/dark)
3. ✅ Implemented two utility classes (`.bloom-text`, `.bloom-border`)
4. ✅ Applied bloom to Hero component (links + border)
5. ✅ Applied bloom to Navbar (logo, nav links, mobile menu)
6. ✅ Applied bloom to HeroPreview (content + border + link)
7. ✅ Applied bloom to ThemeToggle (icons)
8. ✅ Verified build passes with no errors
9. ✅ Tested bloom in light and dark themes
10. ✅ Updated BUILD_DIARY.md with complete session notes

---

_Keep adding new dated sections below for each future session, with specific notes, steps carried out, and any questions or insights._
