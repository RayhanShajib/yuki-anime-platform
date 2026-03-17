# AGENTS.md


## Build, Lint, and Test Commands
- **Development:** `npm run dev` (Next.js dev server on port 3000)
- **Build:** `npm run build` (Next.js production build with TypeScript checking)
- **Start:** `npm run start` (Start production server)
- **Lint:** `npm run lint` (ESLint with `next/core-web-vitals` and `next/typescript` rules)
- **Testing:** No test framework configured. Consider adding Jest (`npm run test`) or Vitest for unit tests.

## Code Style Guidelines
- **Language:** TypeScript strict mode with ES2017 target. Always use explicit type annotations.
- **Imports:** ALWAYS use `@/` path alias for internal imports (`@/components/ui/Button`, `@/lib/utils`). Group external imports first.
- **Components:** PascalCase naming, functional components with TypeScript interfaces, use `"use client"` for client components.
- **Variables/Functions:** camelCase naming, prefix event handlers with `handle`, use descriptive names (`isLoggedIn`, `handleSubmit`).
- **Formatting:** 2-space indentation, trailing commas, single quotes for strings, semicolons required.
- **Error Handling:** Use try/catch for async operations, implement graceful fallbacks, handle loading states properly.
- **File Structure:** Feature-based organization in `src/app/` (App Router) and `src/components/`. Match file names to component names.
- **API Patterns:** Use centralized API client in `src/lib/api/`, type all responses, consistent error handling across endpoints.
- **Styling:** Tailwind CSS with utility classes, use `clsx`/`cn` for conditional classes, mobile-first responsive design.

## TypeScript Patterns
- Use `interface` over `type` for object definitions, explicit return types for functions, proper generic constraints.
- Define props interfaces explicitly (`ComponentNameProps`), use union types for enums (`"pending" | "completed"`).

---
No Cursor or Copilot rules detected. Update this file when adding test framework or changing conventions.
