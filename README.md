# SafarOS — Har Safar Ka Hisaab

**Tour & Travel Company Management — Trips, Customers, Payments, Boarding**

SafarOS is a mobile-first, multi-tenant SaaS application built for tour and travel companies to manage departures, traveler enrollments, installment payments with automatic screenshot UTR extraction (OCR), trip expenses, live QR boarding check-ins, printable invoices/boarding passes, and owner Excel reports.

## Repository File Structure

- `index.html` — Complete single-page SaaS application with SafarOS branding, Google Sign-In + Phone OTP authentication, new company onboarding, subcollection Firestore sync, QR boarding scanner, bill/pass PDF generator, and Excel export.
- `config.js` — Firebase project configuration (`window.FIREBASE_CONFIG`) and SafarOS metadata.
- `manifest.json` — Progressive Web App (PWA) manifest for installing SafarOS on Android/iOS home screens.
- `sw.js` — Offline-capable Service Worker that caches the app shell while keeping Firebase Auth, Firestore, and Storage traffic live.
- `icon.png` / `icon-192.png` / `icon-512.png` — Official SafarOS Orange-to-Purple compass route pin app icons.
- `firestore.rules` — Cloud Firestore Security Rules enforcing strict tenant isolation (`companies/{companyId}/...`).
- `storage.rules` — Firebase Cloud Storage Security Rules isolating company assets under `/companies/{companyId}/**`.
- `functions/index.js` & `functions/package.json` — Scheduled Cloud Function (`dailyCompanyAutoBackup`) for automated daily JSON backups per company.

## Multi-Tenant Firestore Data Architecture

Every document includes `companyId` and is stored under its company's isolated subcollection hierarchy:

```text
users/{uid}
  ├── companyId: string
  ├── role: "owner" | "manager" | "co-owner" | "staff"
  ├── email: string
  ├── phone: string
  └── createdAt: timestamp

companies/{companyId}
  ├── companyId: string
  ├── companyName: string
  ├── tagline: string
  ├── upiId, address, phone, contactEmail, instagramHandle, logoUri, qrUri
  ├── plan: "trial" | "active" | "expired"
  ├── trialEndsAt: string
  ├── trips/{tripId}
  ├── customers/{customerId}
  ├── enrollments/{enrId}
  ├── payments/{paymentId}   (atomic transactions, UTR uniqueness per company, append-only)
  ├── expenses/{expenseId}
  ├── boarding/{boardingId}
  └── bills/{billId}
```

## Step-by-Step Deployment Guide

### 1. Firebase Project & Authentication Setup
1. Open [Firebase Console](https://www.google.com/search?q=https%3A%2F%2Fconsole.firebase.google.com%2F) and create or select your project.
2. Go to **Authentication → Sign-in method** and enable:
   - **Google**
   - **Phone** (for 6-digit SMS OTP login)
3. Go to **Authentication → Settings → Authorized domains** and add your hosting domain (e.g., your GitHub Pages or Vercel domain).
4. Copy your Web App `firebaseConfig` from **Project Settings → General** and paste it into `config.js` (and/or the top of `index.html`).

### 2. Paste Security Rules (Two Separate Places in Firebase Console)
- **Firestore Database Rules (`firestore.rules`)**:
  Go to **Firebase Console → Firestore Database → Rules**, paste the contents of `firestore.rules`, and click **Publish**.
- **Storage Rules (`storage.rules`)**:
  Go to **Firebase Console → Storage → Rules**, paste the contents of `storage.rules`, and click **Publish**.

### 3. Deploy Frontend (GitHub Pages / Vercel / Firebase Hosting)
Upload the root files to your repository or static host:
- `index.html`
- `config.js`
- `manifest.json`
- `sw.js`
- `icon.png` (plus `icon-192.png` and `icon-512.png`)
