// SafarOS — Multi-Tenant SaaS Firebase Configuration
// Paste your Firebase Web App config from:
// Firebase Console -> Project Settings -> General -> Your apps -> Web app
window.FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// App Branding Metadata (Display only — tenant data is isolated per companyId in Firestore)
window.SAFAROS_APP_META = {
  appName: "SafarOS",
  tagline: "Har Safar Ka Hisaab",
  subtitle: "Tour & Travel Company Management - Trips, Customers, Payments, Boarding",
  version: "2.0.0-saas"
};