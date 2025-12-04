# NextJS-ERP — Notes

This repo uses Next.js 16 with Turbopack enabled by default.

Summary of recent changes
- `next.config.ts` includes a `turbopack.root` setting to ensure Turbopack infers the correct workspace root.
- The legacy `middleware.ts` was migrated to the new `proxy.ts` convention (see `proxy.ts`). The original middleware file was kept as a disabled backup and then removed.

Common commands
- Run production build (default, Turbopack):
  ```bash
  npm run build
  ```
- Force Webpack build (if needed):
  ```bash
  npx next build --webpack
  # or
  NEXT_DISABLE_TURBOPACK=1 npm run build
  ```

Proxy / middleware notes
- The repo now uses `proxy.ts` at the repository root to implement request-level redirects/guards.
- `proxy.ts` implements the same logic previously present in `middleware.ts`: it checks a cookie (`Config.tokenKey`) and redirects to `/` when the token is missing. The file includes a `config.matcher` limiting it to routes under `/erp`.

If you want me to re-enable or permanently remove any backup files, or add more documentation, tell me what to do next.
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
