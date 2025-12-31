# Just Search – Platform 1 (Admin & Sales Dashboard)

This is a **production-ready starter** for **Platform 1: Admin & Sales Dashboard** using:

- **Next.js (App Router) + React**
- **Tailwind CSS**
- **shadcn/ui-style components (included locally)**
- **Next.js Route Handlers** (`app/api/**/route.ts`)
- **Google Sheets as Database** (via Service Account + Google Sheets API)

> Notes:
> - This project is built **exactly for your requirement**: Admin/Sales internal dashboard where all data operations read/write Google Sheets.
> - You only need to add your **Google Sheet ID** and **Service Account JSON** in `.env.local`.

---

## 1) Quick Start

### Install
```bash
npm install
```

### Configure Environment
Create `.env.local` (copy from `.env.example`) and fill values:
- `GOOGLE_SHEET_ID`
- `GOOGLE_SERVICE_ACCOUNT_JSON` (stringified JSON)

### Run
```bash
npm run dev
```
Open: http://localhost:3000

---

## 2) Included Screens (UI)

- Login
- Admin Dashboard (reports overview)
- Sales Dashboard (performance overview)
- Clients List
- Create Client Wizard (Step 1: Client Info, Step 2: Pricing, Step 3: Review & Confirm)
- Final Invoice & Proposal (preview)

---

## 3) API Routes (Route Handlers)

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET  /api/clients/list`
- `POST /api/clients/create`
- `GET  /api/pricing/industry`
- `GET  /api/pricing/area`
- `POST /api/invoice/create`
- `GET  /api/reports/admin`
- `GET  /api/reports/sales`

All routes are implemented to work with Google Sheets.

---

## 4) Google Sheets (Database Tables)

Sheets expected inside the same Google Spreadsheet:

1. `Users`
2. `Clients`
3. `Industry_Pricing`
4. `Area_Pricing`
5. `Invoices`
6. `Payments`
7. `Audit_Log`

A schema template is provided in `docs/google-sheets-schema.md`.

---

## 5) Default Admin/Sales Users

For first run, add at least one user row in `Users` sheet:

Columns: `user_id, name, email, username, password_hash, role, status`

Role values:
- `admin`
- `sales`

---

## 6) Security Notes (Recommended for production)
- Store only **bcrypt hashes** in sheet for passwords
- Use `httpOnly` cookies for session token
- Add rate limiting for login and campaign routes
- Add per-role authorization checks (already scaffolded)

---

## 7) Folder Structure

- `app/` UI pages + route handlers
- `components/` UI components (shadcn-like)
- `lib/` Google Sheets client + auth helpers
- `docs/` Documentation & schema

---

If you want, I can also generate:
- Platform 2 (Client Frontend CRM) as a separate app
- Monorepo combining both platforms
- n8n workflow JSON templates
