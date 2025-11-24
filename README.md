# Nutech API Test - Starter Project (Node.js + Express)

## Overview

Starter project implementing Registration, Login, Check Balance, Top Up and Transaction modules.
Uses raw SQL prepared statements with `mysql2/promise`.

## Setup (local)

1. Copy `.env.example` to `.env` and fill values.
2. Create database and run `sql/ddl.sql`.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run in dev:
   ```bash
   npm run dev
   ```
5. API will run on `localhost:${PORT}` (from .env)

## Files

- `src/` — application code
- `sql/db_nutech.sql` — database
- `sql/db_nutech_data.sql` — database berserta Data
- `.env.example` — example env

## Notes

- Match request/response shapes with the Swagger at `https://api-doc-tht.nutech-integrasi.com`.
- All DB operations use prepared statements (`conn.query(sql, params)`).
