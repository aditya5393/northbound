# NorthBound

Travel and tour company management: trips, customers, payments ledger (INR, integer paise), expenses, bills. Web app + secure Supabase backend.

**Status: Functional Web MVP.**
- Database schema with Row Level Security (RLS) across all 11 tables.
- Multi-tenant invitation-based role access (`owner`, `manager`, `staff`).
- Google OAuth login integration.
- Full interactive web dashboard with:
  - Trip creation & switching.
  - Customer directory & trip enrollments.
  - Append-only live payment ledger (`record_payment()` stored procedure with overpayment/duplicate rejection).
  - Trip expense tracking by category.
  - Cashflow & profit margins calculation.
  - Printable booking statements and official paid-in-full receipts.
- Prototype with demo mock data available at `/demo.html`.

## Prerequisites
Node.js 22 LTS, Git, pnpm (`npm install -g pnpm`), a free Supabase account, a Google account, GitHub and Vercel accounts for deployment.

## 1. Install and verify
```bash
pnpm install
pnpm typecheck
pnpm test
```

## 2. Create the database
Create a Supabase project. Apply `supabase/migrations/20261012000000_core_schema.sql` (Supabase CLI `supabase db push`, or paste the file into Dashboard > SQL Editor and run it once). Do NOT run `supabase/seed.sql` on production; it is development data only.

## 3. Google sign-in
Follow `docs/google-signin-setup.md`.

## 4. Environment
Copy `.env.example` to `apps/web/.env.local` and fill the two public values. `.env.local` is git-ignored:
```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```
Never commit secrets and never paste service role keys into client code.

## 5. Make yourself the first owner
Edit and run `docs/provisioning.sql` in the Supabase SQL Editor (one time) to invite your exact Google account email as `owner`.

## 6. Run locally
```bash
pnpm dev
```
Open http://localhost:3000, click Continue with Google.

## 7. Deploy to Vercel
1. Push this repository to GitHub:
   ```bash
   git add .
   git commit -m "Implement core trip management, customer enrollment, and payment ledger UI"
   git remote add origin https://github.com/<your-username>/northbound.git
   git push -u origin main
   ```
2. In Vercel:
   - Click **Add New Project** > import your `northbound` repository.
   - Set **Root Directory** to `apps/web`.
   - Add environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Click **Deploy**.
3. In Supabase:
   - Go to **Authentication > URL Configuration**.
   - Add `https://<your-vercel-domain>/**` to **Redirect URLs**.
   - Set the **Site URL** to `https://<your-vercel-domain>`.
