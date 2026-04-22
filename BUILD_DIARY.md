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

## Current Status (update per session)
- Setting up Astro project (bootstrap completed)
- Styling approach: **Tailwind CSS** chosen
- Next step: Implement homepage and responsive navbar step by step, learning by doing
- Breakpoints: Tailwind **default** (`sm`, `md`, `lg`, `xl`, `2xl`)
- Site max width: **1200px**

## Session Guidance/Prompt
- Treat each session as part of an ongoing series; always check this file first for context and status.
- Record new diary entries for every new working session.
- Summarize what has been accomplished, what decisions were made, and any open questions or problems.
- Each 'future session' should:
  1. Review previous diary entries/decisions
  2. Continue with actionable next steps (broken down, step by step)
  3. Update this document with what happened in the session

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
- [ ] Create a homepage (`src/pages/index.astro`), step by step
- [ ] Create a reusable, responsive NavBar component (in `src/components/Navbar.astro`), step by step
- [ ] Test/verify responsive design in browser

### Rationale & Notes
- **Styling:** Tailwind CSS enables fast iteration and enforces utility-first, responsive design
- **Responsiveness:** Using Tailwind’s default breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`)
- **Max width:** Core content should not exceed 1200px; use `max-w-[1200px] mx-auto` in Tailwind
- **Structure:** NavBar as a reusable component (importable on any page)
- **Process:** All instructions are broken into clear step-by-step units for maximum learning.

### Questions / Considerations
- Are any preferred color palettes or fonts desired for the design?
- What navigation links will the NavBar include (Home, About, Projects, Contact, etc.)?
- Should the NavBar be sticky or minimal on mobile?

---

_Keep adding new dated sections below for each future session, with specific notes, steps carried out, and any questions or insights._
