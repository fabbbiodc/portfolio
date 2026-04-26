---
applyTo: '**'
category: 'technical-reference-guide'
---

# Technical Reference Guide

This document serves as a comprehensive reference for all technologies, techniques, syntax, and patterns used in this portfolio project. Consult this guide whenever you encounter unfamiliar concepts or need quick syntax reminders.

**Note:** When new technologies or techniques are introduced, they should be documented here immediately for future reference.

---

## Table of Contents
1. [Astro](#astro)
   - [Astro Layouts](#astro-layouts)
2. [Content Collections](#content-collections)
3. [Tailwind CSS](#tailwind-css)
4. [HTML & Semantic Elements](#html--semantic-elements)
5. [JavaScript (Client-Side)](#javascript-client-side)
6. [SVG & Icons](#svg--icons)
7. [CSS Animations & Transitions](#css-animations--transitions)
8. [Pure Functions & Utility Modules](#pure-functions--utility-modules)
9. [Menu Utility Module](#menu-utility-module)
10. [Theme System (Dark/Light Mode)](#theme-system-darklight-mode)

---

## Astro

### What is Astro?
Astro is a modern web framework for building fast, content-focused websites with minimal JavaScript. It allows you to build with different UI frameworks or plain HTML, and it automatically optimizes your site for performance by shipping less JavaScript to the browser.

### Astro Components (.astro files)
Astro components are `.astro` files that define reusable page sections or layouts. They use a unique syntax combining frontmatter (top) and markup (bottom).

**File Structure:**
```astro
---
// Frontmatter (runs on the server at build time)
// Import dependencies
import Component from './path/to/component.astro';
import Icon from 'icon-library/icon.svg';

// Define variables and logic
const myVariable = "value";
const items = [1, 2, 3];
---

<!-- Markup (the HTML output) -->
<div>
  <h1>{myVariable}</h1>
  {items.map(item => <p>{item}</p>)}
</div>
```

**Key Points:**
- Frontmatter runs **only at build time** (on the server)
- Variables defined in frontmatter can be used in markup with `{}`
- Markup section outputs the final HTML
- No JavaScript is sent to the browser by default (unless you add `<script>` tags)

### Astro Pages
Files in `src/pages/` automatically become routes. File structure mirrors URL structure:
- `src/pages/index.astro` → `/` (homepage)
- `src/pages/about.astro` → `/about`
- `src/pages/contact.astro` → `/contact`

### Content Collections
Content Collections are Astro's way of managing content-driven pages (blogs, portfolios, docs).

**Setup (Astro 6.x - at project root):**
```typescript
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const programming = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/programming",
  }),
});

const design = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/design",
  }),
});

export const collections = {
  programming,
  design,
};
```

**Usage in pages:**
```astro
---
import { getCollection } from 'astro:content';

const programmingProjects = await getCollection('programming');
const designProjects = await getCollection('design');
---
```

**Adding content:**
```
src/content/programming/project-1.md
src/content/design/project-1.md
```

**When to use:** Perfect for portfolios with many case studies, blogs, documentation.

**Key changes in Astro 6.x:**
- Config file moved from `src/content/config.ts` to `src/content.config.ts` (root)
- Uses `loader` instead of `type: 'content'`
- Import `glob` from `astro/loaders` (not `astro:content`)

### Astro Components
Reusable components go in `src/components/`. They're like Astro pages but don't create routes. Import and use them in pages or other components:

```astro
---
import Navbar from '../components/Navbar.astro';
---

<Navbar />
```

### Astro Layouts
Layouts are special components that define the shared HTML structure for multiple pages. Instead of repeating `<!doctype html>`, `<head>`, `<body>`, and Navbar on every page, you create one Layout and all pages import it.

**File: `src/layouts/Layout.astro`**
```astro
---
import Navbar from "../components/Navbar.astro";
import "../styles/global.css";

interface Props {
  title: string;
}

const { title } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
  </head>
  <body>
    <Navbar />
    <main class="max-w-300 mx-auto px-4 py-10">
      <slot />
    </main>
  </body>
</html>
```

**Using Layout in pages:**
```astro
---
import Layout from "../layouts/Layout.astro";
---

<Layout title="About | My Portfolio">
  <h1>About Me</h1>
  <p>Page-specific content goes here.</p>
</Layout>
```

**Key concepts:**
- **Props:** Layout accepts `title` prop for dynamic page titles
- **Slot:** `<slot />` is a placeholder where page content gets injected
- **Single source:** Change HTML structure in one place, it updates all pages

**Why use layouts:**
- Eliminates code duplication
- Makes maintenance easier
- Ensures consistent page structure across the site

### Astro Script Tag
`<script>` tags in Astro components run **client-side** (in the browser). Each script tag is automatically scoped to that component.

**Key Characteristics:**
- Runs AFTER the component is mounted in the DOM
- Has access to DOM elements via `document.getElementById()`, etc.
- Perfect for interactivity like click handlers, state management, animations
- Does NOT need `client:load` directive (unlike framework components)

```astro
<script>
  // This runs in the browser
  const button = document.getElementById('my-button');
  button?.addEventListener('click', () => {
    console.log('Button clicked!');
  });
</script>
```

### Astro Variables in Markup
Use curly braces `{}` to embed variables in markup:

```astro
---
const linkClasses = "text-text hover:text-brand transition";
---

<a class={linkClasses}>Click me</a>
<!-- Renders: <a class="text-text hover:text-brand transition">Click me</a> -->
```

**Important:** Astro interpolates variables at build time, so they're not dynamic client-side (unless you're re-rendering with JavaScript).

---

## Tailwind CSS

### What is Tailwind CSS?
Tailwind is a utility-first CSS framework. Instead of writing custom CSS, you compose styling by applying pre-defined utility classes to elements.

### Tailwind v4 Setup
Tailwind v4 is CSS-first (previous versions used JavaScript config):

**File: `src/styles/global.css`**
```css
@import url("https://fonts.googleapis.com/css2?family=Archivo:wght@100..900");
@import "tailwindcss";

@theme {
  --color-background: #f8f8f8;
  --color-text: #2d2d2d;
  --color-brand: #5b21b6;
}

@layer base {
  body {
    font-family: "Archivo", sans-serif;
  }
}
```

**Key Concepts:**
- `@import "tailwindcss"` - Imports Tailwind's base styles and utilities
- `@theme { --color-*: value }` - Defines custom color variables. Tailwind auto-generates utility classes (e.g., `text-brand`, `bg-brand`)
- `@layer base { }` - Applies base styles (default element styling) that don't get overridden by utilities
- No `tailwind.config.js` needed in v4 (CSS-based config replaces it)

### Common Tailwind Classes

**Spacing & Layout:**
- `px-4` - Padding on left and right (1rem = 16px)
- `py-4` - Padding on top and bottom
- `mx-auto` - Margin auto (horizontally centers element)
- `gap-6` - Gap between flex/grid children

**Display & Positioning:**
- `flex` - Makes element a flex container
- `justify-between` - Flex: space between items
- `items-center` - Flex: center items vertically
- `absolute` - Absolute positioning
- `relative` - Relative positioning (creates positioning context for children)
- `sticky` - Sticks element to viewport when scrolling
- `top-0` - Top: 0
- `left-0` - Left: 0
- `z-50` - z-index: 50 (layering order)

**Sizing:**
- `w-6` - Width 1.5rem (24px)
- `h-6` - Height 1.5rem (24px)
- `max-w-300` - Max-width ~1200px (Tailwind v4 dynamic sizing)

**Text & Typography:**
- `text-4xl` - Font size 2.25rem
- `font-bold` - Font weight 700
- `text-center` - Text align center
- `text-brand` - Uses custom theme color (--color-brand)

**Visibility & Display:**
- `hidden` - Display none
- `flex` - Display flex
- `overflow-hidden` - Overflow hidden (hides content outside bounds)

**Responsive Prefixes:**
- `md:` - Apply on medium screens and up (768px+)
- Example: `hidden md:flex` - Hidden by default, flex on medium screens+
- Example: `md:hidden` - Visible by default, hidden on medium screens+

**Transitions & Effects:**
- `transition` - Applies CSS transition
- `transition-all` - Transitions all properties
- `duration-300` - Transition duration 300ms
- `hover:text-brand` - Apply class on hover

---

## HTML & Semantic Elements

### Basic HTML Structure
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Page Title</title>
  </head>
  <body>
    <!-- Page content -->
  </body>
</html>
```

**Important Meta Tags:**
- `charset="UTF-8"` - Text encoding
- `viewport` - Enables responsive design on mobile

### Semantic Elements
Use semantic HTML for better accessibility and SEO:

```html
<nav><!-- Navigation links --></nav>
<main><!-- Main page content --></main>
<header><!-- Page or section header --></header>
<footer><!-- Page footer --></footer>
<article><!-- Self-contained content --></article>
<section><!-- Thematic grouping --></section>
```

### Common Elements
```html
<a href="/path">Link text</a>          <!-- Anchor/link -->
<button>Click me</button>              <!-- Button -->
<div>Block container</div>             <!-- Generic block container -->
<span>Inline container</span>          <!-- Generic inline container -->
<h1>Heading 1</h1>                     <!-- Heading (h1-h6) -->
<p>Paragraph</p>                       <!-- Paragraph -->
<ul><li>Item</li></ul>                 <!-- Unordered list -->
<ol><li>Item</li></ol>                 <!-- Ordered list -->
```

---

## JavaScript (Client-Side)

### DOM Manipulation

**Getting Elements:**
```javascript
// Get single element by ID
const element = document.getElementById('my-id');

// Get single element by CSS selector
const element = document.querySelector('.my-class');

// Get multiple elements
const elements = document.querySelectorAll('.my-class');

// Get all anchor tags within a specific element
const links = element.querySelectorAll('a');
```

**Modifying Elements:**
```javascript
// Modify class list
element.classList.add('class-name');          // Add class
element.classList.remove('class-name');       // Remove class
element.classList.toggle('class-name');       // Toggle on/off

// Modify inline styles
element.style.maxHeight = '100px';
element.style.display = 'none';
element.style.opacity = '0.5';

// Get computed property
const height = element.scrollHeight;          // Total height of content
```

**Common Properties:**
```javascript
element.textContent = 'New text';
element.innerHTML = '<strong>HTML</strong>';
element.getAttribute('data-value');
element.setAttribute('data-value', 'new');
```

### Event Listeners

**Basic Syntax:**
```javascript
element.addEventListener('event-name', (event) => {
  // Handle event
});
```

**Common Events:**
- `click` - Mouse click
- `change` - Value changed (inputs)
- `submit` - Form submission
- `scroll` - Page scroll
- `load` - Page/image loaded

**Example:**
```javascript
const button = document.getElementById('my-button');
button.addEventListener('click', () => {
  console.log('Button clicked!');
});
```

### Optional Chaining (`?.`)
Safely access properties of potentially null/undefined values:

```javascript
const element = document.getElementById('maybe-missing');
element?.classList.add('hidden');    // Only adds class if element exists

// Equivalent to:
if (element !== null && element !== undefined) {
  element.classList.add('hidden');
}
```

### Checking Element Containment
```javascript
// Check if element contains another element
if (menuElement.contains(clickedElement)) {
  console.log('Click was inside menu');
} else {
  console.log('Click was outside menu');
}
```

**Useful for click-outside detection:**
```javascript
document.addEventListener('click', (event) => {
  if (!menu.contains(event.target) && !button.contains(event.target)) {
    // Clicked outside both menu and button
    closeMenu();
  }
});
```

### Loops & Iteration

**forEach - Loop through array/collection:**
```javascript
const items = document.querySelectorAll('.item');

items.forEach((item) => {
  item.addEventListener('click', handleClick);
});
```

**map - Transform array:**
```javascript
const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2);  // [2, 4, 6]
```

### Type Assertions (TypeScript)
When TypeScript doesn't know a value's type, use `as`:

```javascript
const element = document.getElementById('my-id') as HTMLElement;
const target = event.target as Node;
```

This tells TypeScript: "Trust me, this value is of this type."

---

## SVG & Icons

### Heroicons Library
Heroicons is a free icon library that pairs well with Tailwind CSS. Icons are SVG files that can be imported as components.

**Import Syntax (Heroicons v2):**
```javascript
import IconName from 'heroicons/[size]/[style]/[icon-name].svg'
```

- `[size]` - Icon size: `16`, `20`, `24`
- `[style]` - Icon style: `solid`, `outline`, `mini`
- `[icon-name]` - Icon name in kebab-case (e.g., `bars-3`, `x-mark`, `home`)

**Examples:**
```javascript
import Bars3Icon from 'heroicons/24/solid/bars-3.svg'           // Hamburger menu
import XMarkIcon from 'heroicons/24/solid/x-mark.svg'           // X icon
import HomeIcon from 'heroicons/24/outline/home.svg'            // Home
```

**Using Icons in Astro:**
```astro
---
import MenuIcon from 'heroicons/24/solid/bars-3.svg'
---

<button>
  <MenuIcon class="w-6 h-6" />
</button>
```

**Common Icon Names:**
- `bars-3` - Hamburger menu (3 lines)
- `x-mark` - X icon (close)
- `home` - Home icon
- `user` - User icon
- `envelope` - Email icon
- `phone` - Phone icon

---

## CSS Animations & Transitions

### Smooth Height Animation (Max-Height Technique)

**Problem:** Animating `height` property doesn't work smoothly because you can't transition to/from `auto`.

**Solution:** Use `max-height` as a proxy:

```css
.menu {
  max-height: 0;              /* Start collapsed */
  overflow: hidden;           /* Hide overflowing content */
  transition-all 300ms;       /* Smooth transition for all properties */
}

.menu.open {
  max-height: 500px;          /* Expand to fixed height */
}
```

**JavaScript Implementation:**
```javascript
const menu = document.getElementById('menu');

// Open menu - set max-height to actual content height
menu.style.maxHeight = menu.scrollHeight + 'px';

// Close menu - set max-height back to 0
menu.style.maxHeight = '0';
```

**Why This Works:**
- `scrollHeight` = actual total height of element's content
- When `max-height` changes from `0` to `scrollHeight`, CSS transition animates it smoothly
- `overflow: hidden` clips content while `max-height` < actual height
- As `max-height` increases, more content becomes visible

**Tailwind Classes:**
- `max-h-0` - max-height: 0
- `max-h-64` - max-height: 16rem (256px)
- `overflow-hidden` - overflow: hidden
- `transition-all` - transition: all properties
- `duration-300` - transition-duration: 300ms

### Border/Shadow in Animated Elements

**Problem:** When animating a collapsible element (like a dropdown), a border or shadow on the element may still be visible when collapsed to `max-height: 0`.

**Solution:** Move the border/shadow to an inner element. The outer element handles the animation (`max-height`, `overflow-hidden`), and the inner element has the visual styling.

```astro
<!-- Outer - handles animation -->
<div class="max-h-0 overflow-hidden transition-all duration-300">
  <!-- Inner - has border/shadow -->
  <div class="border border-text bg-background">
    <!-- content here -->
  </div>
</div>
```

**Why this works:**
- When `max-height: 0` with `overflow: hidden`, the inner content (including border) is clipped
- When expanded, the inner content becomes visible
- Border only appears when the element actually has height

---

## State Management Patterns

### Simple State with JavaScript Variables
For simple components with minimal state:

```javascript
// State variable
let isOpen = false;

// Toggle function
function toggleState() {
  isOpen = !isOpen;
  updateUI();
}

// UI update function
function updateUI() {
  if (isOpen) {
    element.classList.remove('hidden');
  } else {
    element.classList.add('hidden');
  }
}
```

### State with Event Handlers
Common pattern for interactive components:

```javascript
let isOpen = false;
const button = document.getElementById('toggle-btn');
const menu = document.getElementById('menu');

function toggleMenu() {
  isOpen = !isOpen;
  if (isOpen) {
    menu.style.maxHeight = menu.scrollHeight + 'px';
  } else {
    menu.style.maxHeight = '0';
  }
}

button.addEventListener('click', toggleMenu);

// Close on outside click
document.addEventListener('click', (event) => {
  if (!menu.contains(event.target) && !button.contains(event.target) && isOpen) {
    isOpen = false;
    menu.style.maxHeight = '0';
  }
});
```

---

## Common Patterns & Recipes

### Responsive Navigation Pattern
```astro
---
const linkClasses = "text-text hover:text-brand transition";
---

<!-- Desktop nav (visible on md and up) -->
<div class="hidden md:flex gap-6">
  <a href="/" class={linkClasses}>Link 1</a>
  <a href="/" class={linkClasses}>Link 2</a>
</div>

<!-- Mobile nav (visible below md) -->
<button id="hamburger" class="flex md:hidden">Menu</button>
<div id="mobile-menu" class="md:hidden absolute top-full left-0 right-0 max-h-0 overflow-hidden transition-all duration-300">
  <a href="/" class={linkClasses}>Link 1</a>
  <a href="/" class={linkClasses}>Link 2</a>
</div>
```

### Centered Container Pattern
```astro
<div class="max-w-300 mx-auto px-4">
  <!-- Content stays centered, max 1200px width, 1rem padding on sides -->
</div>
```

### Icon Toggle Pattern
```astro
---
import OpenIcon from 'heroicons/24/solid/bars-3.svg'
import CloseIcon from 'heroicons/24/solid/x-mark.svg'
---

<button id="toggle-btn">
  <OpenIcon id="open-icon" class="w-6 h-6" />
  <CloseIcon id="close-icon" class="w-6 h-6 hidden" />
</button>

<script>
  let isOpen = false;
  const btn = document.getElementById('toggle-btn');
  const openIcon = document.getElementById('open-icon');
  const closeIcon = document.getElementById('close-icon');

  btn.addEventListener('click', () => {
    isOpen = !isOpen;
    if (isOpen) {
      openIcon.classList.add('hidden');
      closeIcon.classList.remove('hidden');
    } else {
      openIcon.classList.remove('hidden');
      closeIcon.classList.add('hidden');
    }
  });
</script>
```

---

## Troubleshooting Guide

### Problem: Styles not applying
**Causes:**
- Tailwind class not recognized (typo or invalid combination)
- CSS specificity issue (inline styles override utilities)
- Tailwind not configured properly

**Solution:**
- Check for typos in class names
- Ensure `@import "tailwindcss"` is in global CSS
- Use `!important` as last resort: `!text-red-500`

### Problem: JavaScript not running
**Causes:**
- Script runs before DOM is ready
- Element IDs don't match what's in HTML
- Syntax errors preventing script execution

**Solution:**
- Use `document.addEventListener('DOMContentLoaded', ...)` if needed
- Verify IDs match between HTML and JavaScript
- Check browser console for errors

### Problem: Animation not smooth
**Causes:**
- Using `display: none`/`display: block` (can't be animated)
- Transition duration too short
- Wrong property being animated

**Solution:**
- Use opacity/visibility/max-height instead of display
- Increase duration (e.g., `duration-300`)
- Check which properties you're actually modifying

---

## Pure Functions & Utility Modules

### What are Pure Functions?
Pure functions are functions that:
1. **Always return the same output for the same input** - No hidden dependencies on global state
2. **Have no side effects** - Don't modify external state, DOM, or call external APIs within the function
3. **Are easy to test** - Can be tested independently without mocking
4. **Are reusable** - Can be called from anywhere without worrying about context

**Pure function example:**
```typescript
// Pure - same input always gives same output
export function toggleTheme(currentTheme: string): string {
  return currentTheme === "light" ? "dark" : "light";
}

// Called from anywhere:
const newTheme = toggleTheme("light");  // Always returns "dark"
```

**Impure function example (avoid this):**
```typescript
let globalTheme = "light";  // Hidden dependency!

function toggleTheme() {  // No parameters!
  globalTheme = globalTheme === "light" ? "dark" : "light";
  return globalTheme;  // Output depends on global state
}
```

### Why Use Pure Functions?

| Benefit | Example |
|---------|---------|
| **Predictable** | `toggleTheme("light")` always returns `"dark"` |
| **Testable** | No mocking needed, just call function and check result |
| **Reusable** | Use same function from buttons, keyboard shortcuts, API calls, etc. |
| **Debuggable** | If output is wrong, issue is only in that function, not global state |
| **Composable** | Combine multiple pure functions easily |

### Utility Module Pattern

**File structure:**
```
src/
├── utils/
│   ├── theme.ts          (Pure functions for theme logic)
│   ├── menu.ts           (Pure functions for menu logic)
│   └── validation.ts     (Future: form validation)
└── components/
    ├── ThemeToggle.astro (UI component, imports from utils)
    └── Navbar.astro      (UI component, imports from utils)
```

### Example: Theme Utility Module

**File: `src/utils/theme.ts`**
```typescript
// Pure functions - no side effects, no global state
export function getSystemTheme(): string {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

export function initializeTheme(): string {
  const saved = localStorage.getItem("theme-preference");
  return saved || getSystemTheme();
}

export function toggleTheme(currentTheme: string): string {
  return currentTheme === "light" ? "dark" : "light";
}

// Side-effect functions - modify DOM/storage, explicit operations
export function setTheme(theme: string): void {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme-preference", theme);
}

export function updateThemeUI(theme: string): void {
  const allSunIcons = document.querySelectorAll("#sun-icon");
  const allMoonIcons = document.querySelectorAll("#moon-icon");

  if (theme === "light") {
    allSunIcons.forEach((icon) => icon.classList.remove("hidden"));
    allMoonIcons.forEach((icon) => icon.classList.add("hidden"));
  } else {
    allSunIcons.forEach((icon) => icon.classList.add("hidden"));
    allMoonIcons.forEach((icon) => icon.classList.remove("hidden"));
  }
}
```

### Using Utility Modules in Components

**File: `src/components/ThemeToggle.astro`**
```astro
<script>
  import { initializeTheme, toggleTheme, setTheme, updateThemeUI } from "../utils/theme";

  // Initialize
  let currentTheme = initializeTheme();
  document.documentElement.setAttribute("data-theme", currentTheme);

  // Handle toggle
  function handleToggle() {
    const newTheme = toggleTheme(currentTheme);  // Pure function
    setTheme(newTheme);                          // Side effect
    updateThemeUI(newTheme);                     // Side effect
    currentTheme = newTheme;
  }

  // Attach listeners
  const btn = document.getElementById("theme-toggle-desktop");
  btn?.addEventListener("click", handleToggle);
  
  updateThemeUI(currentTheme);
</script>
```

### Best Practices for Utility Modules

1. **Keep functions small and focused**
   - One function = one responsibility
   - Easy to understand, test, and reuse

2. **Separate pure and side-effect functions**
   - Pure functions have no `void` return (they return data)
   - Side-effect functions often return `void` (they modify external state)

3. **Export everything explicitly**
   - Use `export function` for functions you want to reuse
   - Makes it clear what the module offers

4. **Use TypeScript for clarity**
   - Document input/output types
   - Helps catch bugs early
   - Makes code self-documenting

5. **Follow naming conventions**
   - `get*` - Functions that retrieve/calculate
   - `set*` - Functions that modify state
   - `toggle*` - Functions that flip boolean/dual state
   - `update*` - Functions that modify UI

### Testing Pure Functions

Pure functions are easy to test:

```typescript
// Test: toggleTheme() works correctly
function testToggleTheme() {
  const result1 = toggleTheme("light");
  console.assert(result1 === "dark", "light → dark");
  
  const result2 = toggleTheme("dark");
  console.assert(result2 === "light", "dark → light");
  
  console.log("✓ toggleTheme() tests pass");
}

// Test: getSystemTheme() returns expected values
function testGetSystemTheme() {
  const result = getSystemTheme();
  console.assert(
    result === "light" || result === "dark",
    "returns either light or dark"
  );
  
  console.log("✓ getSystemTheme() tests pass");
}
```

### When to Use Utility Modules

✅ **Good candidates:**
- Theme switching
- Form validation
- Data transformation
- String formatting
- Calculations

❌ **Not good candidates:**
- Single-use logic in a component
- Complex UI state (use framework components instead)
- Heavy business logic (might need a separate backend)

---

## Menu Utility Module

### What is a Menu Utility Module?
A utility module that handles mobile hamburger menu functionality - toggle state, icon visibility, animations, and event listeners. Following the same pure functions pattern as theme.ts.

### File Location
`src/utils/menu.ts`

### Architecture

**Pure Functions (no side effects):**
```typescript
// Flips the menu state (true → false, false → true)
export function toggleMenuState(isOpen: boolean): boolean {
  return !isOpen;
}

// Returns "0" if closed, or actual content height if open
export function calculateMaxHeight(isOpen: boolean, element: HTMLElement): string {
  return isOpen ? element.scrollHeight + "px" : "0";
}
```

**Side-Effect Functions (DOM manipulation):**
```typescript
// Shows/hides hamburger icons based on state
export function updateMenuUI(
  barsIcon: Element | null,
  xIcon: Element | null,
  isOpen: boolean
): void {
  if (isOpen) {
    barsIcon?.classList.add("hidden");
    xIcon?.classList.remove("hidden");
  } else {
    barsIcon?.classList.remove("hidden");
    xIcon?.classList.add("hidden");
  }
}

// Sets the max-height CSS property for animation
export function setMenuMaxHeight(menu: HTMLElement | null, maxHeight: string): void {
  if (menu) {
    menu.style.maxHeight = maxHeight;
  }
}

// Convenience: closes menu in one call
export function closeMenuUI(
  menu: HTMLElement | null,
  barsIcon: Element | null,
  xIcon: Element | null
): void {
  updateMenuUI(barsIcon, xIcon, false);
  setMenuMaxHeight(menu, "0");
}

// Convenience: toggles menu in one call
export function toggleMenuUI(
  menu: HTMLElement | null,
  barsIcon: Element | null,
  xIcon: Element | null,
  isOpen: boolean
): void {
  const newState = toggleMenuState(isOpen);
  updateMenuUI(barsIcon, xIcon, newState);
  setMenuMaxHeight(menu, calculateMaxHeight(newState, menu as HTMLElement));
}

// Setup function: attaches all event listeners
export function setupMenuListeners(
  hamburgerBtn: HTMLElement | null,
  mobileMenu: HTMLElement | null,
  barsIcon: Element | null,
  xIcon: Element | null
): void {
  let isOpen = false;

  // Hamburger click → toggle menu
  hamburgerBtn?.addEventListener("click", () => {
    isOpen = toggleMenuState(isOpen);
    toggleMenuUI(mobileMenu, barsIcon, xIcon, isOpen);
  });

  // Link click → close menu
  mobileMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      isOpen = false;
      closeMenuUI(mobileMenu, barsIcon, xIcon);
    });
  });

  // Outside click → close menu if open
  document.addEventListener("click", (event) => {
    const clickedInside = mobileMenu?.contains(event.target as Node);
    const clickedHamburger = hamburgerBtn?.contains(event.target as Node);

    if (!clickedInside && !clickedHamburger && isOpen) {
      isOpen = false;
      closeMenuUI(mobileMenu, barsIcon, xIcon);
    }
  });
}
```

### Using in Navbar.astro

```astro
<script>
  import { setupMenuListeners } from "../utils/menu";

  const hamburgerBtn = document.getElementById("hamburger");
  const barsIcon = document.getElementById("bars-icon");
  const xIcon = document.getElementById("x-icon");
  const mobileMenu = document.getElementById("mobile-menu") as HTMLElement;

  setupMenuListeners(hamburgerBtn, mobileMenu, barsIcon, xIcon);
</script>
```

### Difference from theme.ts

| Aspect | theme.ts | menu.ts |
|--------|----------|---------|
| State management | Passed as parameter | Maintained in `setupMenuListeners` |
| Reason | Toggle returns new theme, caller manages | Multiple events need shared state |
| Still testable | Yes - pure functions are testable | Yes - `toggleMenuState`, `calculateMaxHeight` are pure |

### Best Practices
- **Pure functions first** - Test `toggleMenuState(false)` returns `true`
- **Side-effect functions explicit** - Name indicates DOM manipulation
- **Setup as entry point** - Component only calls `setupMenuListeners`
- **Keep elements null-safe** - Use `?.` for optional elements

---

## Theme System (Dark/Light Mode)

### What is a Theme System?
A theme system allows users to switch between different color schemes (typically light and dark modes). This project uses CSS variables and a `data-theme` attribute to enable instant theme switching without page reloads.

### Architecture Overview

**Three-Part System:**
1. **Tokens File** (`src/styles/tokens.css`) - Defines CSS variables for light and dark themes
2. **Global CSS** (`src/styles/global.css`) - Imports tokens + keeps `@theme` for Tailwind
3. **JavaScript Logic** (in component scripts) - Handles theme switching and persistence

### Tokens File Structure

**File: `src/styles/tokens.css`**
```css
/* Light Theme (Default) */
:root[data-theme="light"],
:root:not([data-theme]) {
  --color-background: #f8f8f8;
  --color-text: #2d2d2d;
  --color-brand: #5b21b6;
  --color-error: #dc2626;
  --color-warning: #d97706;
  --color-info: #2563eb;
}

/* Dark Theme */
:root[data-theme="dark"] {
  --color-background: #1a1a1a;
  --color-text: #f0f0f0;
  --color-brand: #a78bfa;
  --color-error: #ef4444;
  --color-warning: #f59e0b;
  --color-info: #60a5fa;
}
```

**How It Works:**
- Two CSS selectors targeting `<html>` element
- First selector: Light theme (when `data-theme="light"` OR no `data-theme` attribute - default)
- Second selector: Dark theme (when `data-theme="dark"`)
- Each defines the same CSS variables with theme-appropriate colors
- Tailwind utilities (e.g., `text-brand`, `bg-background`) automatically use these variables

### Global CSS Integration

**File: `src/styles/global.css`**
```css
@import url("https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,100..900;1,100..900&family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap");
@import "./tokens.css";                    /* Import theme tokens */
@import "tailwindcss";

@theme {                                   /* For Tailwind's class generation */
    --color-background: #f8f8f8;
    --color-text: #2d2d2d;
    --color-brand: #5b21b6;
    --color-error: #dc2626;
    --color-warning: #d97706;
    --color-info: #2563eb;
}

@layer base {
    body {
        font-family: "IBM Plex Mono", monospace;
    }
    h1, h2, h3, h4, h5, h6 {
        font-family: "Archivo", sans-serif;
    }
}
```

**Why Both `@theme` and `tokens.css`?**
- `@theme` block (build-time): Tells Tailwind to generate utility classes (e.g., `text-brand`)
- `tokens.css` (runtime): Provides actual color values that change based on theme
- Together they create a system where utilities always exist but their values are dynamic

### Switching Themes in JavaScript

**Basic Theme Switch:**
```javascript
// Get the HTML element
const htmlElement = document.documentElement;

// Switch to dark theme
htmlElement.setAttribute('data-theme', 'dark');

// Switch to light theme
htmlElement.setAttribute('data-theme', 'light');

// Remove theme attribute (uses default light)
htmlElement.removeAttribute('data-theme');
```

**With Toggle Function:**
```javascript
let currentTheme = 'light';

function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
}
```

### Persisting Theme Preference

**Save to localStorage:**
```javascript
function setTheme(theme) {
  // Set the attribute
  document.documentElement.setAttribute('data-theme', theme);
  
  // Save preference
  localStorage.setItem('theme-preference', theme);
}

function getTheme() {
  // Check localStorage first
  const saved = localStorage.getItem('theme-preference');
  if (saved) return saved;
  
  // Fallback to default
  return 'light';
}

// On page load
const savedTheme = getTheme();
document.documentElement.setAttribute('data-theme', savedTheme);
```

### System Preference Detection

**Detect OS Theme:**
```javascript
function getSystemTheme() {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

function initializeTheme() {
  // Priority: 1) localStorage, 2) system preference, 3) light
  const saved = localStorage.getItem('theme-preference');
  
  if (saved) {
    // User has set a preference
    setTheme(saved);
  } else {
    // Use system preference
    const systemTheme = getSystemTheme();
    setTheme(systemTheme);
  }
}

initializeTheme();
```

### Icon Toggle Pattern for Theme Button

**HTML:**
```astro
---
import SunIcon from 'heroicons/24/solid/sun.svg'
import MoonIcon from 'heroicons/24/solid/moon.svg'

const themeToggleClasses = "p-2 rounded hover:bg-opacity-20 hover:bg-brand transition";
---

<button id="theme-toggle" class={themeToggleClasses}>
  <SunIcon id="sun-icon" class="w-6 h-6 text-brand" />
  <MoonIcon id="moon-icon" class="w-6 h-6 text-brand hidden" />
</button>
```

**JavaScript:**
```javascript
const themeToggle = document.getElementById('theme-toggle');
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');
let currentTheme = 'light';

function updateThemeUI() {
  if (currentTheme === 'light') {
    sunIcon.classList.remove('hidden');      // Show sun
    moonIcon.classList.add('hidden');        // Hide moon
  } else {
    sunIcon.classList.add('hidden');         // Hide sun
    moonIcon.classList.remove('hidden');     // Show moon
  }
}

function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  localStorage.setItem('theme-preference', currentTheme);
  updateThemeUI();
}

themeToggle.addEventListener('click', toggleTheme);

// Initialize UI on page load
updateThemeUI();
```

### Color Token Reference

**Light Theme (Default):**
- `--color-background`: #f8f8f8 (Off-white - clean, readable)
- `--color-text`: #2d2d2d (Anthracite - dark, high contrast)
- `--color-brand`: #5b21b6 (Dark purple - primary accent)
- `--color-error`: #dc2626 (Red - error messages)
- `--color-warning`: #d97706 (Amber - warnings)
- `--color-info`: #2563eb (Blue - informational)

**Dark Theme:**
- `--color-background`: #1a1a1a (Near-black - reduces eye strain)
- `--color-text`: #f0f0f0 (Off-white - readable on dark)
- `--color-brand`: #a78bfa (Light purple - matches brand, visible on dark)
- `--color-error`: #ef4444 (Bright red - visible on dark)
- `--color-warning`: #f59e0b (Bright amber - visible on dark)
- `--color-info`: #60a5fa (Bright blue - visible on dark)

### Usage in Components

**Using Theme Colors:**
```astro
<!-- These automatically use theme colors based on data-theme -->
<div class="bg-background text-text">
  <h1 class="text-brand">Heading</h1>
  <p class="text-text">Content adapts to theme</p>
</div>
```

**Custom CSS with Variables:**
```css
.my-element {
  background-color: var(--color-background);
  color: var(--color-text);
  border: 2px solid var(--color-brand);
}
```

### Transition Smoothness

**CSS Transition on Root:**
```css
:root {
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

This creates smooth color transitions when theme changes, improving UX.

---

**Last Updated:** Day 8 (Navbar Enhancements)
**Status:** Navbar made transparent; mobile menu border fix; Layout + all pages created; content collections for Astro 6.x
