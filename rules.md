# AI UI GENERATION RULESET

This document defines all rules the AI model must follow when generating code, UI, or interaction logic. These rules ensure output is consistent with project architecture, UI/UX design system, coding standards, and quality assurance requirements.

---

## ⛔ STOP CONDITIONS

Do not finalize output until:

- All logic is verified
  <!-- - All logic is verified and tested -->
  <!-- - All failing test cases are fixed -->
- All requirements in this file are satisfied
- Any unclear intent is clarified with the user or resolved via external search (e.g., Google)

---

## 📁 PROJECT RULES

### COMPONENT USAGE

- ✅ Use existing shared components when available:  
  `Form`, `FormGroup`, `Input`, `Button`, etc.
- ❌ Do not recreate components if reusable ones exist

### LAYOUT CONSTRAINTS

- Width: `max-width: 360px` (mobile-first)
- Height: allow content to scale, `max-height: 720px`
- Ensure responsive, accessible design

---

## 🧠 LOGIC & STRUCTURE

- ✅ All logic must be organized in separate layers:
  - `components/` → UI
  - `hooks/` → state & logic
  - `services/` → external calls
  - `utils/` → shared utilities
- Code must be:
  - Maintainable (modular)
  - Scalable (extensible)
  - Easy to read (clear naming)

- ✅ Enforce these naming conventions:
  - Variables/functions: `camelCase`
  - Constants/env: `SNAKE_CASE`

---

## 📦 CODE GENERATION RULES

- ✅ Generated code must:
  - Use best practices of the target language and framework
  - Be self-contained and testable
  - Include test files for new logic

- ❌ Do not:
  - Embed business logic inside components
  - Use hardcoded API URLs or inline Supabase calls

- ✅ Mutation pattern:
  - Use `useMutation` from `@tanstack/react-query`
  - All API calls go through `apiClient`
  - If API not ready → create mock service with `browser.storage`

---

## 🔍 VALIDATION RULES

Before finalizing output:

1. Ensure logic correctness (unit test or assert)
2. Run and fix all test cases
3. Ask user if unclear
4. Else, search external sources (Google)

---

## 🧪 TESTING RULES

- ✅ All new logic must include unit/integration tests
- ✅ Run all tests post-generation
- ❌ Do not leave failing tests unresolved
- ✅ Testing stack: `Vitest`, `Jest`, `Testing Library`, or project default

---

## 🎨 UI/UX RULES

### Design System Tokens

- Spacing: 4px or 8px system
- Typography:
  - Max 2 typefaces
  - 16px default font size (web)
  - 14–16px (mobile)
- Colors:
  - Use predefined palette: `primary`, `secondary`, `accent`, `neutral`, `error`
  - Contrast ratio ≥ 4.5:1
- Shadows: soft and consistent
- Corners: rounded (4px–16px)
- Grid system: 12-column (web), 4/8-column (mobile)
- Nesting limit: max 3 levels in UI structure

### Interaction

- All interactive elements (button, link):
  - Have `hover`, `active`, `disabled` states
- Use **skeleton loaders** or **spinners** for async content
- Use **motion** only to enhance interactivity (not decorative)
- Use **modal dialogs** only when inline feedback isn't possible
- Group related content visually (cards, background)

---

## 🎯 REACT-SPECIFIC RULES

- ✅ Forms:
  - Use `React Hook Form` unless custom handler exists
  - All fields must have visible labels and validation
- ✅ Icons:
  - Import from `lucide-react`
  - All icon components must use `Icon` suffix  
    e.g., `HomeIcon`, `SearchIcon`

- ✅ Split concerns:
  - `UI` → component file
  - `logic` → hooks file
  - `styles` → class or style file (or Tailwind)

---

## 📘 GLOBAL PROJECT RULES
