# Account Suite

A local-first accounting web app. It runs on your PC today, stores its data in a
file on your PC, and is structured so you can publish/host it later with a
one-line config change — no rewrite required.

## Tech stack

- **Next.js 14 (App Router) + TypeScript + React** — UI and server logic in one app
- **Prisma ORM** — data access layer; the same code works against SQLite or a
  hosted database
- **SQLite** (default) — a single `prisma/dev.db` file on your machine, no
  database server to install
- **Tailwind CSS** — the dark glass UI theme
- **Recharts** — dashboard/report charts
- **Auth.js (NextAuth v5)** — email/password login, sessions, route protection

## Running locally

```bash
npm install
npm run db:push        # creates prisma/dev.db and the schema
npm run prisma:seed    # loads a starter chart of accounts + sample data
npm run dev            # http://localhost:3000
```

You'll need an `AUTH_SECRET` in your `.env` (see `.env.example` — generate your
own with `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`).

The first time you open the app it sends you to `/signup` to create the one
owner account (email + password). After that, sign-ups are closed and
everyone signs in at `/login` — every page in the app requires being signed
in. There's no invite/multi-user flow yet; if you need more than one login,
say so and it can be added.

All your data lives in `prisma/dev.db` on this computer. Back it up by copying
that file.

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

## Publishing / hosting later

The app was built so moving off your PC is a config change, not a rewrite:

1. Provision a hosted database (Postgres is recommended — e.g. Neon, Supabase,
   Railway, or your own server).
2. In `prisma/schema.prisma`, change:
   ```prisma
   datasource db {
     provider = "postgresql"   // was "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
3. Set `DATABASE_URL` to your hosted database's connection string, and set
   `AUTH_SECRET` to a fresh random value (in a `.env` file locally, or your
   host's environment variables panel). Never reuse the value from your local
   `.env` for a publicly hosted instance.
4. Run `npx prisma db push` once to create the schema on the new database.
5. Deploy the Next.js app (Vercel, Render, a VPS with `npm run build && npm run
   start`, etc.). No application code changes are needed — every data access
   goes through Prisma.
6. Visit the deployed URL — it'll send you to `/signup` to create the owner
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
