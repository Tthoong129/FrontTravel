# LangThang Travel App

React + Vite + Tailwind CSS project.

## Development Server

- Development: `npm run dev` / `pnpm dev`
- Build: `npm run build` / `pnpm build`
- Preview: `npm run preview` / `pnpm preview`

## Project Structure

- `src/main.tsx` - React entrypoint; imports `src/index.css` and mounts `src/App.tsx` into the `#root` element
- `src/App.tsx` - Primary application component (Home page)
- `src/ExplorePage.tsx` - Explore / Discovery page component
- `src/index.css` - Global CSS entrypoint and Tailwind CSS v4 import
- `index.html` - Vite HTML shell containing the `#root` element and loading `src/main.tsx`
- `package.json` - Project dependencies and scripts
- `vite.config.ts` - Vite configuration with React, Tailwind CSS v4 plus the `@` alias for `src`

## Dependencies

- Runtime: React 19, React DOM 19, lucide-react
- Styling: Tailwind CSS v4 with `@tailwindcss/vite`
- Build tooling: Vite 8, TypeScript 5.7, `@vitejs/plugin-react`

## Code quality

- Use double quotes for strings containing apostrophes (`"We're here to help"`), or escape them in single-quoted strings.
- Ensure JSX tags are closed and braces are balanced.
- Export components as default exports.
