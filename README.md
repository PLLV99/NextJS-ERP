# NextJS-ERP

Frontend ERP application built with Next.js, React, and TypeScript.

## Repository Scope
This repository contains the **frontend only**.

- Backend repository: https://github.com/PLLV99/Spring-Boot-ERP

## Tech Stack
- Next.js
- React
- TypeScript
- CSS / Tailwind config

## Actual Project Structure

```text
app/
├── erp/
│   ├── accounting/page.tsx
│   ├── bill-sale/page.tsx
│   ├── components/
│   │   └── Modal.tsx
│   ├── dashboard/page.tsx
│   ├── formula/[id]/page.tsx
│   ├── inventory/page.tsx
│   ├── material/page.tsx
│   ├── production/
│   │   ├── log/[id]/page.tsx
│   │   ├── loss/[id]/page.tsx
│   │   └── page.tsx
│   ├── report/page.tsx
│   ├── sale/page.tsx
│   ├── user/
│   │   ├── edit/page.tsx
│   │   └── page.tsx
│   ├── Sidebar.tsx
│   └── layout.tsx
├── interface/
├── Config.ts
├── favicon.ico
├── globals.css
├── layout.tsx
└── page.tsx

public/
├── file.svg
├── globe.svg
├── next.svg
├── vercel.svg
└── window.svg

Root files:
.env.example, .gitignore, eslint.config.mjs, middleware.disabled.ts, next.config.ts,
package.json, package-lock.json, postcss.config.mjs, proxy.ts, tailwind.config.ts,
tsconfig.json, vercel.json
```

## ERP Modules
- Dashboard
- Sale
- Bill Sale
- Inventory
- Production (main / log / loss)
- Material
- Formula
- Accounting
- Report
- User Management

## Getting Started

The frontend needs the backend API to log in, so start the backend first
(see `PLLV99/Spring-Boot-ERP` — Docker database + `mvnw spring-boot:run` on port 8080).

```bash
git clone https://github.com/PLLV99/NextJS-ERP.git
cd NextJS-ERP
npm install
npm run dev
```

Open: http://localhost:3000

In development, `next.config.ts` forwards `/api/*` to `http://localhost:8080`
(override with the `BACKEND_URL` env var). In production on Vercel, the rewrite
in `vercel.json` routes `/api/*` to the deployed backend instead.

## Notes
- This repository is frontend-only.
- Backend APIs are served by `PLLV99/Spring-Boot-ERP`.
