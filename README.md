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

Copy `.env.example` for local reference if needed. The public site URL is optional. Excursion order requests also require server-side Google Forms variables when that feature is enabled:

```bash
NEXT_PUBLIC_SITE_URL=https://city-advisor-istanbul.vercel.app
GOOGLE_FORM_ACTION_URL=
GOOGLE_FORM_ENTRY_NAME=
GOOGLE_FORM_ENTRY_EMAIL=
GOOGLE_FORM_ENTRY_PHONE=
GOOGLE_FORM_ENTRY_PREFERRED_DATE=
GOOGLE_FORM_ENTRY_PREFERRED_TIME=
GOOGLE_FORM_ENTRY_PEOPLE=
GOOGLE_FORM_ENTRY_MESSAGE=
GOOGLE_FORM_ENTRY_OFFER_NAME=
GOOGLE_FORM_ENTRY_PRICE=
GOOGLE_FORM_ENTRY_DURATION=
GOOGLE_FORM_ENTRY_SOURCE_PAGE_URL=
GOOGLE_FORM_ENTRY_SOURCE_ARTICLE_SLUG=
GOOGLE_FORM_ENTRY_SOURCE_LABEL=
GOOGLE_FORM_ENTRY_SUBMITTED_AT=
```

Set `NEXT_PUBLIC_SITE_URL` in Vercel when a production domain is connected so metadata, robots, and sitemap URLs point to the canonical site.


## Excursion order requests via Google Forms

Excursion order requests are submitted by the existing client form to `/api/excursion-order`, then forwarded server-side to a Google Form `formResponse` endpoint. The browser must not submit directly to Google Forms.

To configure the backend storage workflow:

1. Create a Google Form with the required order fields: name, email, phone, preferred date, preferred time, people, message, offer name, price, duration, source page URL, source article slug, source label, and submitted at.
2. Link the form responses to Google Sheets so each submitted request is recoverable from the linked sheet.
3. Publish the form.
4. Use the form `formResponse` URL as `GOOGLE_FORM_ACTION_URL`.
5. Use a Google Forms pre-filled link or browser DevTools to get every `entry.xxxxx` field ID.
6. Add all `GOOGLE_FORM_*` environment variables from `.env.example` in Vercel Project Settings.
7. Redeploy after adding or changing the environment variables.

The current production Google Form environment values must be configured in Vercel and must not be committed to the repository. The excursion flow intentionally does not add payment, database, CMS, admin, auth, analytics, newsletter provider, Stripe, or checkout integration. Keep the homepage free of commercial CTAs; contextual offers should remain limited to compact partner/ad placement areas without duplicate article blocks, header CTAs, or search result CTAs.

## MVP scope

The MVP uses local TypeScript content files and does not require a database. It focuses on static informational guide pages, categories, blog content, recommendations, search, and contact/subscribe UI placeholders.

## Future roadmap

Future phases may expand content quality, integrate a newsletter/email provider, add admin or content management workflows, introduce monetization partnerships, and grow analytics and SEO capabilities. See `docs/ROADMAP.md` for the phased roadmap.
