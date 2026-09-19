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

## Running locally

```bash
npm install
npm run db:push        # creates prisma/dev.db and the schema
npm run prisma:seed    # loads a starter chart of accounts + sample data
npm run dev            # http://localhost:3000
```

All your data lives in `prisma/dev.db` on this computer. Back it up by copying
that file.

## Modules

**Fully working today**, backed by the local database:

- General Ledger — Chart of Accounts, Journal Entries, Trial Balance, Financial Statements (P&L, Balance Sheet, Cash Flow)
- Accounts Payable — Vendors, Purchase Invoices, Payments, Aging Report
- Accounts Receivable — Customers, Sales Invoices, Receipts, Aging Report
- Cash & Bank — Bank/cash accounts, Transactions, Transfers, Reconciliation

**Scaffolded** (navigation, layout, and design are in place; data model and
CRUD are the next step): Fixed Assets, Budgeting, Expense Management, Tax
Management, Inventory, Sales Management, Purchase Management, Payroll, HR,
Audit & Compliance, Multi-Currency, Project Accounting, Cost Centers,
Manufacturing, POS, Multi-Company, CRM Integration.

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
3. Set `DATABASE_URL` to your hosted database's connection string (in a `.env`
   file locally, or your host's environment variables panel).
4. Run `npx prisma db push` once to create the schema on the new database.
5. Deploy the Next.js app (Vercel, Render, a VPS with `npm run build && npm run
   start`, etc.). No application code changes are needed — every data access
   goes through Prisma.

## Project structure

- `app/` — pages and routes (Next.js App Router), grouped by module
  (`gl/`, `ap/`, `ar/`, `cash-bank/`, `reports/`, plus one folder per
  scaffolded module)
- `components/` — shared UI (sidebar, shell, glass cards, tables, dialogs)
- `lib/` — Prisma client, formatting helpers, report calculations
- `prisma/schema.prisma` — the data model
- `prisma/seed.ts` — starter chart of accounts and demo records
