# City Advisor Istanbul

City Advisor Istanbul is a Next.js MVP for local Istanbul guides aimed at tourists, students, and expats. The project currently uses local TypeScript content files and does not require a database, CMS, authentication, or an admin panel.

## Tech stack

- Next.js App Router
- TypeScript
- React
- Tailwind CSS
- ESLint
- npm

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Optionally copy environment defaults:

   ```bash
   cp .env.example .env.local
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000`.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Build the production Next.js application. |
| `npm run lint` | Run ESLint across the repository. |
| `npm run lint:source` | Run the custom source lint checks. |
| `npm run typecheck` | Run TypeScript without emitting files. |
| `npm run check` | Run linting, typechecking, source linting, and the production build. |

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Optional locally; recommended in production | Canonical public site URL used for metadata, robots, and sitemap output. Defaults to the Vercel preview URL if unset. Set this in Vercel when a production domain is connected. |

## Deployment notes for Vercel

- Use npm as the package manager and install with `npm ci` in CI/deployment environments.
- Set `NEXT_PUBLIC_SITE_URL` to the production domain once a real domain is connected.
- No database or external content service is required for the current MVP.
- The app should pass `npm run check` before deployment.

## Current MVP scope

- Informational city guide pages for Istanbul.
- Local TypeScript content files for guides, blog posts, categories, and recommendations.
- Search, contact, and subscribe UI.
- Basic SEO metadata, sitemap, and robots configuration.

## Future roadmap

- Expand content quality and coverage.
- Integrate a newsletter/email provider.
- Add admin/content management when needed.
- Explore monetization, partners, and advertising.
- Add analytics and SEO growth workflows.
