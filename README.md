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

Copy `.env.example` for local reference if needed. The public site URL is optional. Excursion order, contact, and subscribe submissions share the same server-side Google Form/Sheet variables when those features are enabled:

```bash
NEXT_PUBLIC_SITE_URL=https://city-advisor-istanbul.vercel.app
GOOGLE_FORM_ACTION_URL=
GOOGLE_FORM_ENTRY_NAME=
GOOGLE_FORM_ENTRY_PHONE=
GOOGLE_FORM_ENTRY_PREFERRED_TIME=
GOOGLE_FORM_ENTRY_MESSAGE=
GOOGLE_FORM_ENTRY_OFFER_NAME=
GOOGLE_FORM_ENTRY_PRICE=
GOOGLE_FORM_ENTRY_DURATION=
GOOGLE_FORM_ENTRY_SOURCE_PAGE_URL=
GOOGLE_FORM_ENTRY_SOURCE_ARTICLE_SLUG=
GOOGLE_FORM_ENTRY_SOURCE_LABEL=
# Optional: only set this if the Google Form has a Kitten discount question/column.
GOOGLE_FORM_ENTRY_DISCOUNT_PERCENT=
# Optional: only set this if the Google Form has a Submitted at question/column.
GOOGLE_FORM_ENTRY_SUBMITTED_AT=
# Optional: only set this if the Google Form has a Submission type question/column.
GOOGLE_FORM_ENTRY_SUBMISSION_TYPE=
```

Set `NEXT_PUBLIC_SITE_URL` in Vercel when a production domain is connected so metadata, robots, and sitemap URLs point to the canonical site.


## Site submissions via Google Forms

Excursion order requests are submitted by the existing client form to `/api/excursion-order`, then forwarded server-side to the shared Google Form `formResponse` endpoint. Contact messages and subscribe requests are submitted to `/api/site-lead`, which uses the same `GOOGLE_FORM_ACTION_URL` and linked Google Sheet. The browser must not submit directly to Google Forms.

The excursion order form intentionally asks users for only four visible fields: name, phone, preferred time, and message. Offer, price, duration, source page URL, source article slug, and source label are collected from the contextual partner placement and submitted automatically to separate Google Form fields/Google Sheet columns; they are not appended to the message. The hidden kitten discount is stored client-side with the existing safe localStorage fallback, and when configured it is submitted as its own Google Form field/Google Sheet column rather than being appended to the message.

Contact and subscribe submissions reuse the existing Google Form fields wherever possible. The existing email field is stored with `GOOGLE_FORM_ENTRY_EMAIL`; do not create a separate email environment variable. The optional Google Form field “Submission type” is configured with `GOOGLE_FORM_ENTRY_SUBMISSION_TYPE` and can distinguish rows with these values:

- `excursion_order`
- `contact`
- `subscribe`

To configure the backend storage workflow:

1. Use the existing Google Form and linked Google Sheet for excursion orders, contact messages, and subscribe requests.
2. Ensure the form has the required storage fields: name, email, phone, preferred time, message, offer name, price, duration, source page URL, source article slug, and source label. Add a short-answer field such as “Kitten discount” only if you want the optional discount column, add submitted at only if you want that optional column, and add “Submission type” if you want rows labeled by submission source.
3. Link the form responses to Google Sheets so each submitted request is recoverable from the linked sheet.
4. Publish the form.
5. Use the form `formResponse` URL as `GOOGLE_FORM_ACTION_URL`.
6. Use a Google Forms pre-filled link or browser DevTools to get every `entry.xxxxx` field ID.
7. Add the required `GOOGLE_FORM_*` environment variables from `.env.example` in Vercel Project Settings. If you add the optional kitten discount field, put its `entry.xxxxx` value in `GOOGLE_FORM_ENTRY_DISCOUNT_PERCENT`; this variable is optional and the flows still work when it is not configured. Add `GOOGLE_FORM_ENTRY_SUBMITTED_AT` only when the Google Form actually has that question/column. Add `GOOGLE_FORM_ENTRY_SUBMISSION_TYPE` only when the Google Form has the “Submission type” question/column.
8. Redeploy after adding or changing the environment variables.

The current production Google Form environment values must be configured in Vercel and must not be committed to the repository. These flows intentionally do not add payment, database, CMS, admin, auth, analytics, newsletter provider, Stripe, checkout, separate Google Form configuration, or separate Google Sheet configuration. Keep the homepage free of commercial CTAs; contextual offers should remain limited to compact partner/ad placement areas without duplicate article blocks, header CTAs, or search result CTAs.

## MVP scope

The MVP uses local TypeScript content files and does not require a database. It focuses on static informational guide pages, categories, blog content, recommendations, search, and contact/subscribe UI placeholders.

## Future roadmap

Future phases may expand content quality, integrate a newsletter/email provider, add admin or content management workflows, introduce monetization partnerships, and grow analytics and SEO capabilities. See `docs/ROADMAP.md` for the phased roadmap.
