# City Advisor Istanbul

City Advisor Istanbul is an MVP informational city guide for tourists, students, and expats living in or visiting Istanbul.

## Tech stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS
- Local TypeScript content files

## Local development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Build and verify the project locally:

```bash
npm run check
```

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Starts the Next.js development server. |
| `npm run build` | Builds the production Next.js app. |
| `npm run lint` | Runs ESLint across the repository. |
| `npm run typecheck` | Runs TypeScript type checking without emitting files. |
| `npm run lint:source` | Runs custom source checks. |
| `npm run check` | Runs linting, type checking, source checks, and production build. |

## Vercel deployment notes

This project is ready to deploy on Vercel as a standard Next.js application. Use the default Vercel build command (`npm run build`) and ensure Node.js 22 is selected for parity with CI.

## Environment variables

Copy `.env.example` for local reference if needed. The only current environment variable is optional:

```bash
NEXT_PUBLIC_SITE_URL=https://city-advisor-istanbul.vercel.app
```

Set `NEXT_PUBLIC_SITE_URL` in Vercel when a production domain is connected so metadata, robots, and sitemap URLs point to the canonical site.

## MVP scope

The MVP uses local TypeScript content files and does not require a database. It focuses on static informational guide pages, categories, blog content, recommendations, search, and contact/subscribe UI placeholders.

## Future roadmap

Future phases may expand content quality, integrate a newsletter/email provider, add admin or content management workflows, introduce monetization partnerships, and grow analytics and SEO capabilities. See `docs/ROADMAP.md` for the phased roadmap.
