# Agent Guidelines for yuki-anime-platform

## Commands
- **Build**: `npm run build` (Next.js production build)
- **Dev**: `npm run dev` (Starts development server)
- **Lint**: `npm run lint` (Runs ESLint)
- **Test**: No test runner configured yet.

## Code Style & Architecture
- **Stack**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Radix UI.
- **Components**: Functional components, named exports, PascalCase.
- **Imports**: Use absolute paths with `@/` alias (e.g., `@/components/ui/...`).
- **Styling**: Tailwind CSS. Use `cn()` utility for class merging.
- **State**: React hooks. Favor server components where possible.
- **Icons**: Use `lucide-react` by default.
- **API**: Use `ApiClient` class in `@/lib/api/client.ts`. Handle errors with `ApiError`.
- **File Structure**: Colocate related files. Pages in `src/app`. Shared UI in `src/components/ui`.
- **Formatting**: Prettier rules implied by project structure.
- **Types**: Define interfaces in `@/types/`. Avoid `any`.

## Rules
- Prefer `const` over `let`.
- Ensure accessibility (aria-labels) on interactive elements.
