# Account Suite

An accounting web app built with Next.js, running on a real Postgres database
so the same setup works for local development and for a publicly hosted
instance — no drift between the two.

## Tech stack

- **Next.js 14 (App Router) + TypeScript + React** — UI and server logic in one app
- **Prisma ORM + Postgres** — one database for local dev and production alike
  (Neon, Supabase, Vercel Postgres, or your own server all work)
- **Tailwind CSS** — the dark glass UI theme
- **Recharts** — dashboard/report charts
- **Auth.js (NextAuth v5)** — email/password login, sessions, route protection

## Running locally

You need a Postgres database first — a free one from
[Neon](https://neon.tech) or [Supabase](https://supabase.com) takes a couple
of minutes to set up. Copy `.env.example` to `.env` and fill in:

```bash
DATABASE_URL="postgresql://..."   # your connection string
AUTH_SECRET="..."                 # node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Then:

```bash
npm install
npm run db:push        # creates the schema on your database
npm run prisma:seed    # loads a starter chart of accounts + sample data
npm run dev            # http://localhost:3000
```

The first time you open the app it sends you to `/signup` to create the one
owner account (email + password). After that, sign-ups are closed and
everyone signs in at `/login` — every page in the app requires being signed
in. There's no invite/multi-user flow yet; if you need more than one login,
say so and it can be added.

All your data lives in that Postgres database, not on your machine — most
providers (Neon included) can back it up or let you export a snapshot from
their dashboard.

## Modules

**Fully working today**, backed by the local database:

- General Ledger — Chart of Accounts, Journal Entries, Trial Balance, Financial Statements (P&L, Balance Sheet, Cash Flow)
- Accounts Payable — Vendors, Purchase Invoices, Payments, Aging Report
- Accounts Receivable — Customers, Sales Invoices, Receipts, Aging Report
- Cash & Bank — Bank/cash accounts, Transactions, Transfers, Reconciliation
- Fixed Assets — Asset register, straight-line depreciation, disposal
- Budgeting & Forecasting — Per-account annual budgets vs. actuals
- Expense Management — Claims, approve/reject, reimbursement (posts to Cash & Bank)
- Tax Management — Tax rate registry, sales/purchase tax report
- Inventory / Stock — Item catalog, stock movements, low-stock indicator
- Sales Management — Quotations → Sales Orders → Delivery Notes → Invoice
- Purchase Management — Purchase Orders → Goods Receipt → Invoice
- Point of Sale — Checkout screen posting to Cash & Bank and Inventory
- Multi-Company Management — Company profile registry (see note below)
- CRM Integration — Lead pipeline, convert lead to Customer

**Scaffolded** (navigation and design in place, functionality not yet built):
Payroll, Employee Management (HR), Audit & Compliance, Multi-Currency,
Project Accounting, Cost Center Accounting, Manufacturing/Production.

**Known limitation:** Multi-Company Management stores company profiles and an
"active" flag, but all modules still share one set of books regardless of
which company is marked active — full per-company data separation isn't wired
up yet.

## Publishing / hosting

1. Set `DATABASE_URL` (your Postgres connection string — can be the same
   database you use locally, or a separate one) and a **fresh** `AUTH_SECRET`
   in your host's environment variables panel. Never reuse your local
   `AUTH_SECRET` for a publicly hosted instance.
2. Run `npx prisma db push` once against that database if it doesn't already
   have the schema.
3. Deploy the Next.js app (Vercel, Render, a VPS with `npm run build && npm run
   start`, etc.).
4. Visit the deployed URL — it sends you to `/signup` to create the owner
   account on that database, exactly like the first run locally.

## Project structure

- `app/(app)/` — every authenticated page and route, grouped by module
  (`gl/`, `ap/`, `ar/`, `cash-bank/`, `reports/`, plus one folder per module)
- `app/(auth)/` — `/login` and `/signup`, rendered without the app sidebar
- `app/api/auth/` — Auth.js route handler
- `components/` — shared UI (sidebar, shell, glass cards, tables, dialogs)
- `lib/` — Prisma client, auth config, formatting helpers, report calculations
- `middleware.ts` — redirects signed-out visitors to `/login` on every route
- `prisma/schema.prisma` — the data model
- `prisma/seed.ts` — starter chart of accounts and demo records
