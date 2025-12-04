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

# NextJS-ERP — Project README

Short description (EN):
This repository contains a Next.js 16 application for a simple ERP UI built using the App Router. It includes features for accounting, inventory, production, sales and user management.

คำอธิบายสั้น ๆ (TH):
โปรเจ็คนี้เป็นแอป Next.js 16 (App Router) สำหรับระบบ ERP เบื้องต้น มีหน้าฟีเจอร์สำหรับบัญชี, สินค้าคงคลัง, การผลิต, การขาย และการจัดการผู้ใช้

Getting started / การเริ่มต้น
- Install dependencies:
  ```bash
  npm install
  ```
- Run development server:
  ```bash
  npm run dev
  # Open http://localhost:3000
  ```

Production build / คำสั่ง build
- Default (Turbopack — recommended):
  ```bash
  npm run build
  ```
- Force Webpack (if you need webpack-only behavior or troubleshooting):
  ```bash
  npx next build --webpack
  # or (cross-shell note: on Windows bash the env var works as below)
  NEXT_DISABLE_TURBOPACK=1 npm run build
  ```

Why Turbopack changes were made / เหตุผลการแก้ไข Turbopack
- Next.js 16 enables Turbopack by default. Because the project had a custom `webpack` configuration (alias for `@`), Next required an explicit `turbopack` config to avoid an error. We added `turbopack.root` in `next.config.ts` so Turbopack correctly infers the workspace root.

Proxy migration (middleware → proxy) / การย้ายจาก middleware ไป proxy
- Modern Next.js replaces the `middleware` file convention with `proxy`. To follow the latest convention and remove the deprecation warning we migrated the logic from `middleware.ts` to `proxy.ts` (root of repo).
- What the proxy does:
  - Reads a cookie using `Config.tokenKey` and redirects to `/` when token is missing.
  - The proxy only applies to paths under `/erp` (see `config.matcher` in `proxy.ts`).

Where to look / ไฟล์สำคัญ
- `next.config.ts` — project config (includes `turbopack.root` and custom webpack alias for `@`).
- `proxy.ts` — request-level guard (replacement for `middleware.ts`).
- `app/` — application pages and components.
- `app/Config.ts` — configuration including `tokenKey` used by the proxy.

Testing & validation / ทดสอบ
- Build locally to verify production build:
  ```bash
  npm run build
  ```
- Run the app and test a protected route under `/erp` to confirm redirect behavior when `Config.tokenKey` cookie is absent.

Deployment notes / การDeploy
- Deploy as a standard Next.js app (Vercel, Azure Static Web Apps, or container). If deploying to an environment that relies on Webpack-only features, consider the `NEXT_DISABLE_TURBOPACK=1` option or `--webpack` flag during build.

Contributing / การร่วมพัฒนา
- Create a branch, make smaller PRs, and include a clear description of the change.

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
