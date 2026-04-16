import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

// Validate Firebase config
const isConfigValid = firebaseConfig.apiKey && !firebaseConfig.apiKey.includes('YOUR_');

if (!isConfigValid) {
  console.log(
    '⚠️  Demo Mode: Firebase not configured. Features will be UI-only.\n' +
    'To enable Sign In/Sign Up, create .env.local with Firebase credentials.\n' +
    'See .env.example for template.'
  );
}

// Initialize Firebase only if config is valid
let app;
let auth;
let db;

try {
  if (isConfigValid) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
  } else {
    // Dummy init - app runs in demo mode
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (error) {
  console.log('Running in demo mode - Firebase features disabled');
}

export { auth, db };
export default app;
