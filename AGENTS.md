# AGENTS.md

## Build, Lint, and Test Commands
- **Development:** `npm run dev` (Next.js dev server)
- **Build:** `npm run build` (Next.js production build)
- **Start:** `npm run start` (Start production server)
- **Lint:** `npm run lint` (ESLint with Next.js rules)
- **Testing:** *No test script or framework present; add one if needed (e.g., Jest, Vitest).*

## Code Style Guidelines
- **Language:** TypeScript (`strict` mode enabled)
- **Imports:** Use ES module syntax; prefer path alias `@/` for `src/` imports.
- **Formatting:** Follow Next.js/Prettier defaults (2 spaces, trailing commas, single quotes).
- **Naming:** 
  - Components: PascalCase
  - Variables/functions: camelCase
- **Types:** Always annotate function parameters and return types.
- **Error Handling:** Use try/catch for async code; handle errors gracefully in UI.
- **ESLint:** Uses `next/core-web-vitals` and `next/typescript` rules.
- **JSX:** Use `"jsx": "preserve"` (React/Next.js conventions).
- **File Structure:** Organize by feature in `src/app/` and `src/components/`.
- **General:** Write clean, readable, and maintainable code. Avoid magic numbers/strings.

---
If you add a test framework or style guide, update this file accordingly. No Cursor or Copilot rules detected.
