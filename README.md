This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

If you want me to add more sections (environment variables, architecture diagram, CI steps), tell me what to include and I will update the README accordingly.

## NextJS-ERP

NextJS-ERP is a Next.js 16 (App Router) application that provides a minimal ERP UI for accounting, inventory, production, sales and user management.

This README is intentionally concise — it covers the commands and pointers you need to run and develop the project. For detailed notes (proxy migration, env, CI) see the `docs/` folder (or ask me to add it).

Quick start

- Install dependencies:
  ```bash
  npm install
  ```
- Start development server:
  ```bash
  npm run dev
  ```
- Production build:
  ```bash
  npm run build
  npm start
  ```

Useful scripts

- `npm run dev` — start dev server (hot reload)
- `npm run build` — production build (Turbopack by default)
- `npm start` — start the production server after build
- `npm run lint` — run ESLint

Turbopack and Webpack

- Next.js 16 enables Turbopack by default. This project contains a small `webpack` customization (alias `@`) so we added `turbopack.root` in `next.config.ts` to avoid a Turbopack/webpack conflict.
- If you need to force Webpack instead of Turbopack:
  ```bash
  npx next build --webpack
  # or
  NEXT_DISABLE_TURBOPACK=1 npm run build
  ```

Proxy (replacement for middleware)

- The project uses `proxy.ts` (at repository root) as the modern replacement for `middleware.ts`.
- `proxy.ts` implements an auth guard that checks a cookie named by `Config.tokenKey` and redirects unauthenticated requests to `/` for routes under `/erp`.

Environment variables

The project centralizes a few settings in `app/Config.ts`. Current keys and suggested env names:

- `apiUrl` — base API path. Suggested env: `NEXT_PUBLIC_API_URL` (client-safe).
- `apiKey` — service API key. Suggested env: `API_KEY` (server-only).
- `tokenKey` — cookie name for auth token. Suggested env: `NEXT_PUBLIC_TOKEN_KEY`.

Example `.env` (not committed):
```
NEXT_PUBLIC_API_URL=https://api.example.com
API_KEY=your-secret-api-key
NEXT_PUBLIC_TOKEN_KEY=token_erp
```

Security note: never expose sensitive secrets with the `NEXT_PUBLIC_` prefix; use server-only env vars for secrets.

Where to look

- `next.config.ts` — project config and `turbopack.root`
- `proxy.ts` — request-level guard (auth check)
- `app/Config.ts` — central configuration
- `app/` — app routes, components, and pages

Contributing

- Fork & create a branch for changes
- Keep PRs small and focused

If you want the README shorter, or want me to add `docs/DETAILS.md` with step-by-step migration notes and CI examples, say so and I'll add it and push the change.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# SpringBoot-ERP
